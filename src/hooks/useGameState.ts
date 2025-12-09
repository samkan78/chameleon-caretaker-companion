/**
 * useGameState Hook
 * Manages all game state including pet stats, finances, and persistence
 * Uses localStorage for data persistence between sessions
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  Pet, 
  PlayerFinances, 
  PetStats, 
  Expense, 
  Badge,
  AVAILABLE_BADGES,
  calculateMood,
  getMoodColor,
  ACTION_COSTS
} from '@/types/pet';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'chameleon_pet_game_state';
const STAT_DECAY_INTERVAL = 10000; // Stats decrease every 10 seconds

// Generate unique ID for expenses
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create initial pet state
function createInitialPet(name: string): Pet {
  return {
    name,
    stats: {
      hunger: 70,
      happiness: 70,
      health: 100,
      energy: 80,
      cleanliness: 90,
    },
    mood: 'happy',
    age: 0,
    createdAt: new Date(),
    evolutionStage: 1,
    tricks: [],
    color: getMoodColor('happy'),
  };
}

// Create initial finances state
function createInitialFinances(): PlayerFinances {
  return {
    balance: 50, // Starting money
    totalSpent: 0,
    totalEarned: 50,
    expenses: [],
    savingsGoal: 100,
    savingsProgress: 0,
  };
}

// Create initial game state
function createInitialGameState(): GameState {
  return {
    pet: createInitialPet(''),
    finances: createInitialFinances(),
    badges: [],
    completedChores: [],
    lastUpdated: new Date(),
    isFirstTime: true,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from localStorage on initial render
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.pet.createdAt = new Date(parsed.pet.createdAt);
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.finances.expenses = parsed.finances.expenses.map((e: Expense) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        parsed.badges = parsed.badges.map((b: Badge) => ({
          ...b,
          earnedAt: b.earnedAt ? new Date(b.earnedAt) : undefined,
        }));
        return parsed;
      } catch {
        return createInitialGameState();
      }
    }
    return createInitialGameState();
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Stat decay over time (simulates pet needs)
  useEffect(() => {
    if (gameState.isFirstTime) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newStats: PetStats = {
          hunger: Math.max(0, prev.pet.stats.hunger - 2),
          happiness: Math.max(0, prev.pet.stats.happiness - 1),
          health: prev.pet.stats.hunger < 20 || prev.pet.stats.cleanliness < 20 
            ? Math.max(0, prev.pet.stats.health - 2) 
            : prev.pet.stats.health,
          energy: Math.max(0, prev.pet.stats.energy - 1),
          cleanliness: Math.max(0, prev.pet.stats.cleanliness - 1),
        };

        const newMood = calculateMood(newStats);

        return {
          ...prev,
          pet: {
            ...prev.pet,
            stats: newStats,
            mood: newMood,
            color: getMoodColor(newMood),
          },
          lastUpdated: new Date(),
        };
      });
    }, STAT_DECAY_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.isFirstTime]);

  // Initialize pet with a name
  const initializePet = useCallback((name: string) => {
    if (!name.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name for your chameleon.",
        variant: "destructive",
      });
      return false;
    }

    if (name.length > 20) {
      toast({
        title: "Name Too Long",
        description: "Please use a name with 20 characters or less.",
        variant: "destructive",
      });
      return false;
    }

    const newPet = createInitialPet(name.trim());
    const firstBadge = AVAILABLE_BADGES.find(b => b.id === 'first_pet');
    
    setGameState(prev => ({
      ...prev,
      pet: newPet,
      isFirstTime: false,
      badges: firstBadge ? [{ ...firstBadge, earnedAt: new Date() }] : [],
    }));

    toast({
      title: "Welcome!",
      description: `${name} is ready to be your new pet!`,
    });

    return true;
  }, []);

  // Update pet stats with a specific action
  const updateStats = useCallback((statChanges: Partial<PetStats>) => {
    setGameState(prev => {
      const newStats: PetStats = { ...prev.pet.stats };
      
      Object.entries(statChanges).forEach(([key, value]) => {
        const statKey = key as keyof PetStats;
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value || 0)));
      });

      const newMood = calculateMood(newStats);

      return {
        ...prev,
        pet: {
          ...prev.pet,
          stats: newStats,
          mood: newMood,
          color: getMoodColor(newMood),
        },
        lastUpdated: new Date(),
      };
    });
  }, []);

  // Spend money on pet care
  const spendMoney = useCallback((actionKey: string): boolean => {
    const action = ACTION_COSTS[actionKey];
    if (!action) return false;

    if (gameState.finances.balance < action.cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${action.cost} but only have $${gameState.finances.balance}. Complete chores to earn more!`,
        variant: "destructive",
      });
      return false;
    }

    const expense: Expense = {
      id: generateId(),
      category: action.category,
      description: action.description,
      amount: action.cost,
      timestamp: new Date(),
    };

    setGameState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        balance: prev.finances.balance - action.cost,
        totalSpent: prev.finances.totalSpent + action.cost,
        expenses: [expense, ...prev.finances.expenses].slice(0, 50), // Keep last 50
      },
    }));

    return true;
  }, [gameState.finances.balance]);

  // Earn money from chores
  const earnMoney = useCallback((amount: number, choreId: string) => {
    setGameState(prev => {
      const newBadges = [...prev.badges];
      const newCompletedChores = [...prev.completedChores, choreId];
      
      // Check for hard worker badge
      if (newCompletedChores.length >= 10 && !prev.badges.find(b => b.id === 'hard_worker')) {
        const badge = AVAILABLE_BADGES.find(b => b.id === 'hard_worker');
        if (badge) {
          newBadges.push({ ...badge, earnedAt: new Date() });
          toast({
            title: "Badge Earned!",
            description: `You earned the "${badge.name}" badge!`,
          });
        }
      }

      const newBalance = prev.finances.balance + amount;
      
      // Check for money saver badge
      if (newBalance >= 100 && !prev.badges.find(b => b.id === 'money_saver')) {
        const badge = AVAILABLE_BADGES.find(b => b.id === 'money_saver');
        if (badge) {
          newBadges.push({ ...badge, earnedAt: new Date() });
          toast({
            title: "Badge Earned!",
            description: `You earned the "${badge.name}" badge!`,
          });
        }
      }

      return {
        ...prev,
        finances: {
          ...prev.finances,
          balance: newBalance,
          totalEarned: prev.finances.totalEarned + amount,
        },
        badges: newBadges,
        completedChores: newCompletedChores,
      };
    });

    toast({
      title: "Money Earned!",
      description: `You earned $${amount}!`,
    });
  }, []);

  // Perform care action (feed, play, etc.)
  const performAction = useCallback((action: string): boolean => {
    let statChanges: Partial<PetStats> = {};
    let actionKey = '';

    switch (action) {
      case 'feed':
        statChanges = { hunger: 25, energy: 5 };
        actionKey = 'feed';
        break;
      case 'treat':
        statChanges = { hunger: 15, happiness: 20 };
        actionKey = 'treat';
        break;
      case 'play':
        statChanges = { happiness: 25, energy: -15 };
        actionKey = 'play';
        break;
      case 'rest':
        statChanges = { energy: 35, happiness: 5 };
        // Rest is free!
        updateStats(statChanges);
        toast({ title: "Rest Time", description: `${gameState.pet.name} is taking a nap!` });
        return true;
      case 'clean':
        statChanges = { cleanliness: 40, happiness: 5 };
        actionKey = 'bath';
        break;
      case 'vet':
        statChanges = { health: 50 };
        actionKey = 'vetVisit';
        break;
      case 'medicine':
        statChanges = { health: 30, happiness: -10 };
        actionKey = 'medicine';
        break;
      default:
        return false;
    }

    if (actionKey && !spendMoney(actionKey)) {
      return false;
    }

    updateStats(statChanges);

    // Check for badges
    setGameState(prev => {
      const newBadges = [...prev.badges];
      
      if (prev.pet.stats.happiness >= 100 && !prev.badges.find(b => b.id === 'happy_camper')) {
        const badge = AVAILABLE_BADGES.find(b => b.id === 'happy_camper');
        if (badge) {
          newBadges.push({ ...badge, earnedAt: new Date() });
          toast({
            title: "Badge Earned!",
            description: `You earned the "${badge.name}" badge!`,
          });
        }
      }

      return { ...prev, badges: newBadges };
    });

    const actionMessages: Record<string, string> = {
      feed: `${gameState.pet.name} enjoyed the meal!`,
      treat: `${gameState.pet.name} loved the treat!`,
      play: `${gameState.pet.name} had fun playing!`,
      clean: `${gameState.pet.name} is squeaky clean!`,
      vet: `${gameState.pet.name} had a checkup!`,
      medicine: `${gameState.pet.name} took medicine.`,
    };

    toast({
      title: "Action Complete",
      description: actionMessages[action] || "Action performed!",
    });

    return true;
  }, [gameState.pet.name, spendMoney, updateStats]);

  // Teach a new trick
  const teachTrick = useCallback((trickName: string) => {
    if (gameState.pet.stats.energy < 30) {
      toast({
        title: "Too Tired",
        description: `${gameState.pet.name} is too tired to learn right now.`,
        variant: "destructive",
      });
      return false;
    }

    if (gameState.pet.tricks.includes(trickName)) {
      toast({
        title: "Already Learned",
        description: `${gameState.pet.name} already knows this trick!`,
      });
      return false;
    }

    setGameState(prev => {
      const newTricks = [...prev.pet.tricks, trickName];
      const newBadges = [...prev.badges];

      if (newTricks.length >= 3 && !prev.badges.find(b => b.id === 'trick_master')) {
        const badge = AVAILABLE_BADGES.find(b => b.id === 'trick_master');
        if (badge) {
          newBadges.push({ ...badge, earnedAt: new Date() });
          toast({
            title: "Badge Earned!",
            description: `You earned the "${badge.name}" badge!`,
          });
        }
      }

      return {
        ...prev,
        pet: {
          ...prev.pet,
          tricks: newTricks,
          stats: {
            ...prev.pet.stats,
            energy: Math.max(0, prev.pet.stats.energy - 20),
            happiness: Math.min(100, prev.pet.stats.happiness + 15),
          },
        },
        badges: newBadges,
      };
    });

    toast({
      title: "New Trick Learned!",
      description: `${gameState.pet.name} learned "${trickName}"!`,
    });

    return true;
  }, [gameState.pet]);

  // Reset game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(createInitialGameState());
    toast({
      title: "Game Reset",
      description: "Your game has been reset. Start fresh!",
    });
  }, []);

  return {
    gameState,
    initializePet,
    updateStats,
    spendMoney,
    earnMoney,
    performAction,
    teachTrick,
    resetGame,
  };
}
