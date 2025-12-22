/**
 * StatsDisplay Component
 * Compact horizontal stat bars that show pet's current vital statistics
 */

import { PetStats } from '@/types/pet';
import { Progress } from '@/components/ui/progress';

interface StatsDisplayProps {
  stats: PetStats;
}

// Stat configuration for icons and colors
const STAT_CONFIG = {
  hunger: { icon: '🍎', label: 'Food', color: 'bg-stat-hunger' },
  happiness: { icon: '😊', label: 'Joy', color: 'bg-stat-happiness' },
  health: { icon: '❤️', label: 'HP', color: 'bg-stat-health' },
  energy: { icon: '⚡', label: 'Energy', color: 'bg-stat-energy' },
  cleanliness: { icon: '✨', label: 'Clean', color: 'bg-stat-cleanliness' },
};

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {(Object.entries(STAT_CONFIG) as [keyof PetStats, typeof STAT_CONFIG.hunger][]).map(
        ([key, config]) => {
          const value = stats[key];
          return (
            <div
              key={key}
              className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm rounded-full px-2 py-1 border border-border/30"
              title={`${config.label}: ${Math.round(value)}%`}
            >
              <span className="text-sm">{config.icon}</span>
              <Progress
                value={value}
                className="w-12 h-2"
                indicatorClassName={config.color}
              />
              <span className="text-xs font-medium text-foreground/70 w-6">
                {Math.round(value)}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
}
