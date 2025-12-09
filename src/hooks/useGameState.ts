/**
 * useGameState Hook
 * Manages all game state including pet stats, evolution, finances, and persistence
 * Stats decay over time, pet grows and reacts to care
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, 
  Pet, 
  PlayerFinances, 
  PetStats, 
  Expense, 
  Badge,
  VetRecord,
  ChameleonType,
  ReactionType,
  AVAILABLE_BADGES,
  CHAMELEON_TYPES,
  VET_SERVICES,
  calculateMood,
  getMoodColor,
  ACTION_COSTS,
  getEvolutionStage,
  calculateAge,
} from '@/types/pet';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'chameleon_pet_game_state';
const STAT_DECAY_INTERVAL = 8000; // Stats decrease every 8 seconds
const PLAY_TIME_INTERVAL = 60000; // Track play time every minute
const AGE_CHECK_INTERVAL = 30000; // Check for evolution every 30 seconds

// Generate unique ID for records
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create initial pet state
function createInitialPet(name: string, type: ChameleonType): Pet {
  const typeInfo = CHAMELEON_TYPES[type];
  return {
    name,
    type,
    stats: {
      hunger: 75,
      happiness: 80,
      health: 100,
      energy: 85,
      cleanliness: 95,
    },
    mood: 'happy',
    age: 0,
    createdAt: new Date(),
    evolutionStage: 1,
    tricks: [],
    color: getMoodColor('happy', typeInfo.baseColor),
    currentReaction: 'none',
    vetHistory: [],
    lastVetVisit: undefined,
  };
}

// Create initial finances state
function createInitialFinances(): PlayerFinances {
  return {
    balance: 50,
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
    pet: createInitialPet('', 'veiled'),
    finances: createInitialFinances(),
    badges: [],
    completedChores: [],
    lastUpdated: new Date(),
    isFirstTime: true,
    totalPlayTime: 0,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.pet.createdAt = new Date(parsed.pet.createdAt);
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.pet.lastVetVisit = parsed.pet.lastVetVisit ? new Date(parsed.pet.lastVetVisit) : undefined;
        parsed.finances.expenses = parsed.finances.expenses.map((e: Expense) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        parsed.badges = parsed.badges.map((b: Badge) => ({
          ...b,
          earnedAt: b.earnedAt ? new Date(b.earnedAt) : undefined,
        }));
        parsed.pet.vetHistory = (parsed.pet.vetHistory || []).map((v: VetRecord) => ({
          ...v,
          date: new Date(v.date),
        }));
        // Ensure new fields exist
        parsed.totalPlayTime = parsed.totalPlayTime || 0;
        parsed.pet.currentReaction = parsed.pet.currentReaction || 'none';
        parsed.pet.type = parsed.pet.type || 'veiled';
        return parsed;
      } catch {
        return createInitialGameState();
      }
    }
    return createInitialGameState();
  });

  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Set reaction with auto-clear
  const setReaction = useCallback((reaction: ReactionType) => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    
    setGameState(prev => ({
      ...prev,
      pet: { ...prev.pet, currentReaction: reaction },
    }));

    reactionTimeoutRef.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        pet: { ...prev.pet, currentReaction: 'none' },
      }));
    }, 1500);
  }, []);

  // Stat decay over time
  useEffect(() => {
    if (gameState.isFirstTime) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newStats: PetStats = {
          hunger: Math.max(0, prev.pet.stats.hunger - 2),
          happiness: Math.max(0, prev.pet.stats.happiness - 1),
          health: prev.pet.stats.hunger < 20 || prev.pet.stats.cleanliness < 20 
            ? Math.max(0, prev.pet.stats.health - 3) 
            : Math.max(0, prev.pet.stats.health - 0.5),
          energy: Math.max(0, prev.pet.stats.energy - 1),
          cleanliness: Math.max(0, prev.pet.stats.cleanliness - 1.5),
        };

        const newMood = calculateMood(newStats);
        const typeInfo = CHAMELEON_TYPES[prev.pet.type];

        return {
          ...prev,
          pet: {
            ...prev.pet,
            stats: newStats,
            mood: newMood,
            color: getMoodColor(newMood, typeInfo.baseColor),
          },
          lastUpdated: new Date(),
        };
      });
    }, STAT_DECAY_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.isFirstTime]);

  // Track play time
  useEffect(() => {
    if (gameState.isFirstTime) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + 1,
      }));
    }, PLAY_TIME_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.isFirstTime]);

  // Check for evolution
  useEffect(() => {
    if (gameState.isFirstTime) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newAge = calculateAge(prev.pet.createdAt, prev.totalPlayTime);
        const newStage = getEvolutionStage(newAge);
        
        if (newStage !== prev.pet.evolutionStage) {
          const stageName = newStage === 2 ? 'Juvenile' : 'Adult';
          toast({
            title: '🎉 Evolution!',
            description: `${prev.pet.name} evolved into a ${stageName}!`,
          });

          // Award evolution badge
          const badgeId = newStage === 2 ? 'evolution_1' : 'evolution_2';
          const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
          const newBadges = [...prev.badges];
          
          if (badge && !prev.badges.find(b => b.id === badgeId)) {
            newBadges.push({ ...badge, earnedAt: new Date() });
          }

          return {
            ...prev,
            pet: {
              ...prev.pet,
              age: newAge,
              evolutionStage: newStage,
              currentReaction: 'sparkle',
            },
            badges: newBadges,
          };
        }

        return { ...prev, pet: { ...prev.pet, age: newAge } };
      });
    }, AGE_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.isFirstTime]);

  // Initialize pet with name and type
  const initializePet = useCallback((name: string, type: ChameleonType) => {
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

    const newPet = createInitialPet(name.trim(), type);
    const firstBadge = AVAILABLE_BADGES.find(b => b.id === 'first_pet');
    
    setGameState(prev => ({
      ...prev,
      pet: newPet,
      isFirstTime: false,
      badges: firstBadge ? [{ ...firstBadge, earnedAt: new Date() }] : [],
    }));

    toast({
      title: "Welcome!",
      description: `${name} has hatched! Take good care of your new ${CHAMELEON_TYPES[type].name}!`,
    });

    return true;
  }, []);

  // Update pet stats
  const updateStats = useCallback((statChanges: Partial<PetStats>) => {
    setGameState(prev => {
      const newStats: PetStats = { ...prev.pet.stats };
      
      Object.entries(statChanges).forEach(([key, value]) => {
        const statKey = key as keyof PetStats;
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value || 0)));
      });

      const newMood = calculateMood(newStats);
      const typeInfo = CHAMELEON_TYPES[prev.pet.type];

      return {
        ...prev,
        pet: {
          ...prev.pet,
          stats: newStats,
          mood: newMood,
          color: getMoodColor(newMood, typeInfo.baseColor),
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
        expenses: [expense, ...prev.finances.expenses].slice(0, 50),
      },
    }));

    return true;
  }, [gameState.finances.balance]);

  // Earn money from chores
  const earnMoney = useCallback((amount: number, choreId: string) => {
    setGameState(prev => {
      const newBadges = [...prev.badges];
      const newCompletedChores = [...prev.completedChores, choreId];
      
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

  // Perform care action
  const performAction = useCallback((action: string): boolean => {
    let statChanges: Partial<PetStats> = {};
    let actionKey = '';
    let reaction: ReactionType = 'none';

    switch (action) {
      case 'feed':
        statChanges = { hunger: 25, energy: 5 };
        actionKey = 'feed';
        reaction = 'eating';
        break;
      case 'treat':
        statChanges = { hunger: 15, happiness: 20 };
        actionKey = 'treat';
        reaction = 'love';
        break;
      case 'play':
        statChanges = { happiness: 25, energy: -15 };
        actionKey = 'play';
        reaction = 'playing';
        break;
      case 'rest':
        statChanges = { energy: 35, happiness: 5 };
        reaction = 'sleeping';
        updateStats(statChanges);
        setReaction(reaction);
        toast({ title: "Rest Time", description: `${gameState.pet.name} is taking a nap!` });
        return true;
      case 'clean':
        statChanges = { cleanliness: 40, happiness: 5 };
        actionKey = 'bath';
        reaction = 'sparkle';
        break;
      default:
        return false;
    }

    if (actionKey && !spendMoney(actionKey)) {
      return false;
    }

    updateStats(statChanges);
    setReaction(reaction);

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
    };

    toast({
      title: "Action Complete",
      description: actionMessages[action] || "Action performed!",
    });

    return true;
  }, [gameState.pet.name, spendMoney, updateStats, setReaction]);

  // Perform vet service
  const performVetService = useCallback((serviceType: keyof typeof VET_SERVICES): boolean => {
    const service = VET_SERVICES[serviceType];
    if (!service) return false;

    if (gameState.finances.balance < service.cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${service.cost} for this service.`,
        variant: "destructive",
      });
      return false;
    }

    // Create expense
    const expense: Expense = {
      id: generateId(),
      category: 'health',
      description: service.name,
      amount: service.cost,
      timestamp: new Date(),
    };

    // Create vet record
    const vetRecord: VetRecord = {
      id: generateId(),
      type: serviceType,
      description: service.name,
      cost: service.cost,
      date: new Date(),
      healthBoost: service.healthBoost,
    };

    setGameState(prev => {
      const newVetHistory = [vetRecord, ...prev.pet.vetHistory].slice(0, 20);
      const newBadges = [...prev.badges];

      // Check for vet regular badge
      if (newVetHistory.length >= 5 && !prev.badges.find(b => b.id === 'vet_regular')) {
        const badge = AVAILABLE_BADGES.find(b => b.id === 'vet_regular');
        if (badge) {
          newBadges.push({ ...badge, earnedAt: new Date() });
          toast({
            title: "Badge Earned!",
            description: `You earned the "${badge.name}" badge!`,
          });
        }
      }

      const newHealth = Math.min(100, prev.pet.stats.health + service.healthBoost);
      const newStats = { ...prev.pet.stats, health: newHealth };
      const newMood = calculateMood(newStats);
      const typeInfo = CHAMELEON_TYPES[prev.pet.type];

      return {
        ...prev,
        pet: {
          ...prev.pet,
          stats: newStats,
          mood: newMood,
          color: getMoodColor(newMood, typeInfo.baseColor),
          vetHistory: newVetHistory,
          lastVetVisit: new Date(),
          currentReaction: 'healing',
        },
        finances: {
          ...prev.finances,
          balance: prev.finances.balance - service.cost,
          totalSpent: prev.finances.totalSpent + service.cost,
          expenses: [expense, ...prev.finances.expenses].slice(0, 50),
        },
        badges: newBadges,
      };
    });

    setReaction('healing');

    toast({
      title: `${service.icon} ${service.name}`,
      description: `${gameState.pet.name} received care. +${service.healthBoost} health!`,
    });

    return true;
  }, [gameState.finances.balance, gameState.pet.name, setReaction]);

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
          currentReaction: 'sparkle',
        },
        badges: newBadges,
      };
    });

    setReaction('sparkle');

    toast({
      title: "New Trick Learned!",
      description: `${gameState.pet.name} learned "${trickName}"!`,
    });

    return true;
  }, [gameState.pet, setReaction]);

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
    performVetService,
    teachTrick,
    resetGame,
  };
}
