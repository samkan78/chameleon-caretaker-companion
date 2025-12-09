/**
 * ActionButtons Component
 * Provides interactive buttons for all pet care actions
 * Shows costs and effects for each action
 */

import { Button } from '@/components/ui/button';
import { ACTION_COSTS } from '@/types/pet';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  onAction: (action: string) => boolean;
  balance: number;
  className?: string;
}

interface ActionConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
  effect: string;
  category: 'food' | 'activity' | 'health' | 'care';
}

const ACTIONS: ActionConfig[] = [
  { 
    id: 'feed', 
    label: 'Feed', 
    icon: '🍎', 
    description: 'Give your pet a meal',
    effect: '+25 Hunger, +5 Energy',
    category: 'food'
  },
  { 
    id: 'treat', 
    label: 'Treat', 
    icon: '🍬', 
    description: 'Special snack',
    effect: '+15 Hunger, +20 Happiness',
    category: 'food'
  },
  { 
    id: 'play', 
    label: 'Play', 
    icon: '🎾', 
    description: 'Have fun together',
    effect: '+25 Happiness, -15 Energy',
    category: 'activity'
  },
  { 
    id: 'rest', 
    label: 'Rest', 
    icon: '😴', 
    description: 'Take a nap (FREE)',
    effect: '+35 Energy, +5 Happiness',
    category: 'activity'
  },
  { 
    id: 'clean', 
    label: 'Bath', 
    icon: '🛁', 
    description: 'Get squeaky clean',
    effect: '+40 Cleanliness, +5 Happiness',
    category: 'care'
  },
  { 
    id: 'vet', 
    label: 'Vet Visit', 
    icon: '🏥', 
    description: 'Professional checkup',
    effect: '+50 Health',
    category: 'health'
  },
  { 
    id: 'medicine', 
    label: 'Medicine', 
    icon: '💊', 
    description: 'Quick health boost',
    effect: '+30 Health, -10 Happiness',
    category: 'health'
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  food: 'from-stat-hunger/20 to-stat-hunger/5 border-stat-hunger/30 hover:border-stat-hunger/50',
  activity: 'from-stat-happiness/20 to-stat-happiness/5 border-stat-happiness/30 hover:border-stat-happiness/50',
  health: 'from-stat-health/20 to-stat-health/5 border-stat-health/30 hover:border-stat-health/50',
  care: 'from-stat-cleanliness/20 to-stat-cleanliness/5 border-stat-cleanliness/30 hover:border-stat-cleanliness/50',
};

export function ActionButtons({ onAction, balance, className }: ActionButtonsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-display font-semibold text-lg text-foreground">
        Care Actions
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ACTIONS.map((action) => {
          const cost = ACTION_COSTS[action.id]?.cost || 0;
          const canAfford = action.id === 'rest' || balance >= cost;

          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={!canAfford}
              className={cn(
                "group relative p-4 rounded-xl border-2 bg-gradient-to-br transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg active:translate-y-0",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
                CATEGORY_COLORS[action.category]
              )}
              title={`${action.description}\n${action.effect}`}
            >
              {/* Icon */}
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              
              {/* Label */}
              <div className="font-display font-semibold text-sm text-foreground">
                {action.label}
              </div>
              
              {/* Cost badge */}
              <div 
                className={cn(
                  "absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full",
                  action.id === 'rest' 
                    ? "bg-primary/20 text-primary" 
                    : canAfford 
                      ? "bg-accent/20 text-accent" 
                      : "bg-destructive/20 text-destructive"
                )}
              >
                {action.id === 'rest' ? 'FREE' : `$${cost}`}
              </div>

              {/* Effect tooltip on hover */}
              <div className="absolute inset-x-0 -bottom-1 opacity-0 group-hover:opacity-100 group-hover:bottom-full transition-all duration-200 pointer-events-none z-10">
                <div className="mx-2 mb-2 p-2 bg-card border border-border rounded-lg shadow-lg text-xs">
                  <p className="text-muted-foreground">{action.description}</p>
                  <p className="text-primary font-semibold mt-1">{action.effect}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
