/**
 * Pet Types and Interfaces
 * Defines all data structures for the Virtual Chameleon Pet application
 */

// Chameleon species types available for selection
export type ChameleonType = 'veiled' | 'panther' | 'jackson';

// Species display info
export const CHAMELEON_TYPES: Record<ChameleonType, { 
  name: string; 
  description: string; 
  baseColor: string;
  pattern: 'striped' | 'spotted' | 'gradient';
  icon: string;
}> = {
  veiled: {
    name: 'Veiled Chameleon',
    description: 'Hardy & colorful with a tall casque',
    baseColor: '#2ECC71',
    pattern: 'striped',
    icon: '🌿',
  },
  panther: {
    name: 'Panther Chameleon',
    description: 'Vibrant colors & bold personality',
    baseColor: '#3498DB',
    pattern: 'spotted',
    icon: '🐆',
  },
  jackson: {
    name: "Jackson's Chameleon",
    description: 'Three-horned & gentle natured',
    baseColor: '#27AE60',
    pattern: 'gradient',
    icon: '🦕',
  },
};

// Evolution stages with size multipliers
export const EVOLUTION_STAGES = {
  1: { name: 'Hatchling', sizeMultiplier: 0.6, minAge: 0 },
  2: { name: 'Juvenile', sizeMultiplier: 0.8, minAge: 3 },
  3: { name: 'Adult', sizeMultiplier: 1.0, minAge: 7 },
} as const;

// Possible mood states for the chameleon
export type PetMood = 'happy' | 'sad' | 'sick' | 'energetic' | 'tired' | 'neutral' | 'hungry' | 'dirty';

// Reaction types for animations
export type ReactionType = 'love' | 'eating' | 'playing' | 'sleeping' | 'healing' | 'sparkle' | 'none';

// Pet statistics interface - tracks all vital stats
export interface PetStats {
  hunger: number;      // 0-100, higher = more fed
  happiness: number;   // 0-100, higher = happier
  health: number;      // 0-100, higher = healthier
  energy: number;      // 0-100, higher = more energetic
  cleanliness: number; // 0-100, higher = cleaner
}

// Tank environment settings
export interface TankEnvironment {
  temperature: number; // 65-95°F range, optimal 75-85°F
}

// Optimal temperature range for chameleons
export const OPTIMAL_TEMP = { min: 75, max: 85 };
export const TEMP_RANGE = { min: 65, max: 95 };

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

// Vet appointment record
export interface VetRecord {
  id: string;
  type: 'checkup' | 'vaccination' | 'treatment' | 'emergency';
  description: string;
  cost: number;
  date: Date;
  healthBoost: number;
}

// Main pet state interface
export interface Pet {
  name: string;
  type: ChameleonType;
  stats: PetStats;
  mood: PetMood;
  age: number; // in days
  createdAt: Date;
  evolutionStage: 1 | 2 | 3;
  tricks: string[];
  color: string; // current chameleon color based on mood
  currentReaction: ReactionType;
  vetHistory: VetRecord[];
  lastVetVisit?: Date;
  tankEnvironment: TankEnvironment; // Tank settings
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
  totalPlayTime: number; // minutes
}

// Action costs for various pet care activities
export const ACTION_COSTS: Record<string, { cost: number; category: Expense['category']; description: string }> = {
  feed: { cost: 5, category: 'food', description: 'Pet food' },
  treat: { cost: 8, category: 'food', description: 'Special treat' },
  play: { cost: 3, category: 'toy', description: 'Play session' },
  newToy: { cost: 15, category: 'toy', description: 'New toy' },
  checkup: { cost: 25, category: 'health', description: 'Routine checkup' },
  vaccination: { cost: 35, category: 'health', description: 'Vaccination' },
  treatment: { cost: 20, category: 'health', description: 'Health treatment' },
  emergency: { cost: 50, category: 'health', description: 'Emergency care' },
  medicine: { cost: 12, category: 'health', description: 'Medicine' },
  bath: { cost: 8, category: 'grooming', description: 'Bath supplies' },
  bedding: { cost: 10, category: 'supplies', description: 'Fresh bedding' },
};

// Vet services available
export const VET_SERVICES = {
  checkup: { 
    name: 'Routine Checkup', 
    cost: 25, 
    healthBoost: 30, 
    description: 'General health examination',
    icon: '🩺',
    cooldownHours: 4,
  },
  vaccination: { 
    name: 'Vaccination', 
    cost: 35, 
    healthBoost: 15, 
    description: 'Preventive immunization',
    icon: '💉',
    cooldownHours: 24,
  },
  treatment: { 
    name: 'Treatment', 
    cost: 20, 
    healthBoost: 40, 
    description: 'Medicine and care',
    icon: '💊',
    cooldownHours: 2,
  },
  emergency: { 
    name: 'Emergency Care', 
    cost: 50, 
    healthBoost: 60, 
    description: 'Urgent medical attention',
    icon: '🚑',
    cooldownHours: 0, // No cooldown for emergencies
  },
};

// Available chores to earn money
export const AVAILABLE_CHORES: Chore[] = [
  { id: 'clean_room', name: 'Clean Room', description: 'Tidy up your space', reward: 10, cooldownMinutes: 30, icon: '🧹' },
  { id: 'homework', name: 'Do Homework', description: 'Complete your assignments', reward: 15, cooldownMinutes: 60, icon: '📚' },
  { id: 'dishes', name: 'Wash Dishes', description: 'Clean the dishes', reward: 8, cooldownMinutes: 20, icon: '🍽️' },
  { id: 'laundry', name: 'Do Laundry', description: 'Wash and fold clothes', reward: 12, cooldownMinutes: 45, icon: '👕' },
  { id: 'yard_work', name: 'Yard Work', description: 'Help with outdoor tasks', reward: 20, cooldownMinutes: 90, icon: '🌱' },
  { id: 'pet_care', name: 'Help with Pets', description: 'Assist with family pets', reward: 10, cooldownMinutes: 40, icon: '🐾' },
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
  { id: 'vet_regular', name: 'Vet Regular', description: 'Visit the vet 5 times', icon: '🩺', requirement: 'Complete 5 vet visits' },
  { id: 'evolution_1', name: 'Growing Up', description: 'Your pet evolved to juvenile', icon: '🌱', requirement: 'Reach juvenile stage' },
  { id: 'evolution_2', name: 'All Grown Up', description: 'Your pet evolved to adult', icon: '🌳', requirement: 'Reach adult stage' },
];

// Helper function to determine mood based on stats
export function calculateMood(stats: PetStats): PetMood {
  // Priority-based mood calculation
  if (stats.health < 25) return 'sick';
  if (stats.hunger < 20) return 'hungry';
  if (stats.cleanliness < 20) return 'dirty';
  if (stats.energy < 15) return 'tired';
  if (stats.happiness < 25) return 'sad';
  if (stats.energy > 80 && stats.happiness > 75) return 'energetic';
  if (stats.happiness > 70 && stats.hunger > 60 && stats.health > 70) return 'happy';
  return 'neutral';
}

// Get chameleon color based on mood
export function getMoodColor(mood: PetMood, baseColor?: string): string {
  const colors: Record<PetMood, string> = {
    happy: '#FFD93D',      // Bright yellow
    sad: '#6B7FD7',        // Soft blue
    sick: '#9B59B6',       // Purple
    energetic: '#FF6B35',  // Vibrant orange
    tired: '#74B9FF',      // Light blue
    neutral: baseColor || '#2ECC71', // Green or base
    hungry: '#E67E22',     // Orange-brown
    dirty: '#8B7355',      // Muddy brown
  };
  return colors[mood];
}

// Get evolution stage based on age
export function getEvolutionStage(age: number): 1 | 2 | 3 {
  if (age >= 7) return 3;
  if (age >= 3) return 2;
  return 1;
}

// Calculate age in days from creation date and play time
export function calculateAge(createdAt: Date, totalPlayTime: number): number {
  // 1 in-game day = 5 minutes of play time
  return Math.floor(totalPlayTime / 5);
}
