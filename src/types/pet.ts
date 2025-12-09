/**
 * Pet Types and Interfaces
 * Defines all data structures for the Virtual Chameleon Pet application
 */

// Possible mood states for the chameleon
export type PetMood = 'happy' | 'sad' | 'sick' | 'energetic' | 'tired' | 'neutral';

// Pet statistics interface - tracks all vital stats
export interface PetStats {
  hunger: number;      // 0-100, higher = more fed
  happiness: number;   // 0-100, higher = happier
  health: number;      // 0-100, higher = healthier
  energy: number;      // 0-100, higher = more energetic
  cleanliness: number; // 0-100, higher = cleaner
}

// Individual expense record for tracking costs
export interface Expense {
  id: string;
  category: 'food' | 'toy' | 'health' | 'supplies' | 'grooming';
  description: string;
  amount: number;
  timestamp: Date;
}

// Chore/task for earning currency
export interface Chore {
  id: string;
  name: string;
  description: string;
  reward: number;
  cooldownMinutes: number;
  lastCompleted?: Date;
  icon: string;
}

// Achievement/badge earned by the player
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  requirement: string;
}

// Main pet state interface
export interface Pet {
  name: string;
  stats: PetStats;
  mood: PetMood;
  age: number; // in days
  createdAt: Date;
  evolutionStage: number; // 1 = baby, 2 = teen, 3 = adult
  tricks: string[];
  color: string; // current chameleon color based on mood
}

// Player/user financial state
export interface PlayerFinances {
  balance: number;
  totalSpent: number;
  totalEarned: number;
  expenses: Expense[];
  savingsGoal: number;
  savingsProgress: number;
}

// Complete game state
export interface GameState {
  pet: Pet;
  finances: PlayerFinances;
  badges: Badge[];
  completedChores: string[];
  lastUpdated: Date;
  isFirstTime: boolean;
}

// Action costs for various pet care activities
export const ACTION_COSTS: Record<string, { cost: number; category: Expense['category']; description: string }> = {
  feed: { cost: 5, category: 'food', description: 'Pet food' },
  treat: { cost: 8, category: 'food', description: 'Special treat' },
  play: { cost: 3, category: 'toy', description: 'Play session' },
  newToy: { cost: 15, category: 'toy', description: 'New toy' },
  vetVisit: { cost: 25, category: 'health', description: 'Vet checkup' },
  medicine: { cost: 12, category: 'health', description: 'Medicine' },
  bath: { cost: 8, category: 'grooming', description: 'Bath supplies' },
  bedding: { cost: 10, category: 'supplies', description: 'Fresh bedding' },
};

// Available chores to earn money
export const AVAILABLE_CHORES: Chore[] = [
  { id: 'clean_room', name: 'Clean Room', description: 'Tidy up your space', reward: 10, cooldownMinutes: 30, icon: '🧹' },
  { id: 'homework', name: 'Do Homework', description: 'Complete your assignments', reward: 15, cooldownMinutes: 60, icon: '📚' },
  { id: 'dishes', name: 'Wash Dishes', description: 'Clean the dishes', reward: 8, cooldownMinutes: 20, icon: '🍽️' },
  { id: 'laundry', name: 'Do Laundry', description: 'Wash and fold clothes', reward: 12, cooldownMinutes: 45, icon: '👕' },
  { id: 'yard_work', name: 'Yard Work', description: 'Help with outdoor tasks', reward: 20, cooldownMinutes: 90, icon: '🌱' },
];

// Available badges
export const AVAILABLE_BADGES: Badge[] = [
  { id: 'first_pet', name: 'New Pet Parent', description: 'Named your first chameleon', icon: '🎉', requirement: 'Name your pet' },
  { id: 'well_fed', name: 'Master Chef', description: 'Keep hunger above 80 for a full session', icon: '🍽️', requirement: 'Maintain high hunger stat' },
  { id: 'happy_camper', name: 'Joy Bringer', description: 'Reach 100% happiness', icon: '😊', requirement: 'Max out happiness' },
  { id: 'clean_freak', name: 'Squeaky Clean', description: 'Give 5 baths in one session', icon: '🛁', requirement: 'Bath your pet 5 times' },
  { id: 'money_saver', name: 'Smart Saver', description: 'Save $100 in your balance', icon: '💰', requirement: 'Accumulate $100' },
  { id: 'hard_worker', name: 'Super Helper', description: 'Complete 10 chores', icon: '⭐', requirement: 'Do 10 chores' },
  { id: 'healthy_pet', name: 'Health Hero', description: 'Keep health at 100% for 5 minutes', icon: '❤️', requirement: 'Maintain perfect health' },
  { id: 'trick_master', name: 'Trick Trainer', description: 'Teach your pet 3 tricks', icon: '🎪', requirement: 'Train 3 tricks' },
];

// Helper function to determine mood based on stats
export function calculateMood(stats: PetStats): PetMood {
  const average = (stats.hunger + stats.happiness + stats.health + stats.energy + stats.cleanliness) / 5;
  
  if (stats.health < 30) return 'sick';
  if (stats.energy < 20) return 'tired';
  if (stats.happiness < 30) return 'sad';
  if (stats.energy > 80 && stats.happiness > 70) return 'energetic';
  if (average > 70) return 'happy';
  return 'neutral';
}

// Get chameleon color based on mood
export function getMoodColor(mood: PetMood): string {
  const colors: Record<PetMood, string> = {
    happy: '#FFD93D',      // Bright yellow
    sad: '#6B7FD7',        // Soft blue
    sick: '#9B59B6',       // Purple
    energetic: '#FF6B35',  // Vibrant orange
    tired: '#74B9FF',      // Light blue
    neutral: '#2ECC71',    // Green
  };
  return colors[mood];
}
