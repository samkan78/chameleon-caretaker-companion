/**
 * StatsDisplay Component
 * Shows all pet statistics with visual progress bars
 * Each stat has its own color and icon for easy identification
 */

import { PetStats } from '@/types/pet';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StatsDisplayProps {
  stats: PetStats;
  className?: string;
}

interface StatConfig {
  label: string;
  icon: string;
  colorClass: string;
  description: string;
}

const STAT_CONFIG: Record<keyof PetStats, StatConfig> = {
  hunger: {
    label: 'Hunger',
    icon: '🍎',
    colorClass: 'bg-stat-hunger',
    description: 'How well-fed your pet is',
  },
  happiness: {
    label: 'Happiness',
    icon: '💛',
    colorClass: 'bg-stat-happiness',
    description: 'Your pet\'s emotional wellbeing',
  },
  health: {
    label: 'Health',
    icon: '❤️',
    colorClass: 'bg-stat-health',
    description: 'Overall physical health',
  },
  energy: {
    label: 'Energy',
    icon: '⚡',
    colorClass: 'bg-stat-energy',
    description: 'Activity level and stamina',
  },
  cleanliness: {
    label: 'Cleanliness',
    icon: '✨',
    colorClass: 'bg-stat-cleanliness',
    description: 'How clean your pet is',
  },
};

function getStatLevel(value: number): string {
  if (value >= 80) return 'Excellent';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Fair';
  if (value >= 20) return 'Low';
  return 'Critical';
}

export function StatsDisplay({ stats, className }: StatsDisplayProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Pet Stats
      </h3>
      
      {(Object.keys(stats) as Array<keyof PetStats>).map((statKey) => {
        const config = STAT_CONFIG[statKey];
        const value = stats[statKey];
        const level = getStatLevel(value);
        const isLow = value < 30;
        const isCritical = value < 15;

        return (
          <div
            key={statKey}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              isCritical ? "bg-destructive/10 animate-pulse" : "bg-muted/50",
              isLow && !isCritical && "bg-accent/10"
            )}
            title={config.description}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg" role="img" aria-label={config.label}>
                  {config.icon}
                </span>
                <span className="font-display font-medium text-sm text-foreground">
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    isCritical && "bg-destructive/20 text-destructive",
                    isLow && !isCritical && "bg-accent/20 text-accent",
                    !isLow && "bg-primary/10 text-primary"
                  )}
                >
                  {level}
                </span>
                <span className="text-sm font-bold text-foreground min-w-[36px] text-right">
                  {Math.round(value)}%
                </span>
              </div>
            </div>
            
            <Progress 
              value={value} 
              className="h-2.5"
              indicatorClassName={cn(
                config.colorClass,
                "transition-all duration-500"
              )}
            />
          </div>
        );
      })}

      {/* Warning message for low stats */}
      {Object.values(stats).some(v => v < 20) && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive font-medium animate-fade-in-up">
          ⚠️ Some stats are critically low! Take care of your pet soon.
        </div>
      )}
    </div>
  );
}
