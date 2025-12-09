/**
 * BadgesPanel Component
 * Displays earned badges and available badges to earn
 * Shows progress toward achievements
 */

import { Badge, AVAILABLE_BADGES } from '@/types/pet';
import { cn } from '@/lib/utils';

interface BadgesPanelProps {
  earnedBadges: Badge[];
  className?: string;
}

export function BadgesPanel({ earnedBadges, className }: BadgesPanelProps) {
  const earnedIds = new Set(earnedBadges.map(b => b.id));

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-display font-semibold text-lg text-foreground">
        Achievements
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AVAILABLE_BADGES.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          const earnedBadge = earnedBadges.find(b => b.id === badge.id);

          return (
            <div
              key={badge.id}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all duration-300",
                isEarned 
                  ? "bg-gradient-to-br from-mood-happy/20 to-mood-energetic/10 border-mood-happy/40 shadow-md" 
                  : "bg-muted/30 border-border opacity-50 grayscale"
              )}
              title={isEarned ? `Earned: ${badge.name}` : `Locked: ${badge.requirement}`}
            >
              <div className={cn(
                "text-3xl mb-2",
                isEarned && "animate-bounce-soft"
              )}>
                {badge.icon}
              </div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {badge.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {isEarned ? badge.description : badge.requirement}
              </p>
              {isEarned && earnedBadge?.earnedAt && (
                <p className="text-xs text-primary mt-2 font-medium">
                  ✓ Earned
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-primary">{earnedBadges.length}</span>
          {' / '}
          <span>{AVAILABLE_BADGES.length}</span>
          {' badges earned'}
        </p>
      </div>
    </div>
  );
}
