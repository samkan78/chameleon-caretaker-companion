/**
 * ChoresPanel Component
 * Displays available chores that can be completed to earn money
 * Tracks cooldowns and rewards for each chore
 */

import { useState, useEffect } from 'react';
import { AVAILABLE_CHORES, Chore } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChoresPanelProps {
  onCompleteChore: (amount: number, choreId: string) => void;
  className?: string;
}

interface ChoreState {
  lastCompleted?: Date;
  isOnCooldown: boolean;
  remainingTime: number;
}

export function ChoresPanel({ onCompleteChore, className }: ChoresPanelProps) {
  const [choreStates, setChoreStates] = useState<Record<string, ChoreState>>({});

  // Update cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setChoreStates(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        AVAILABLE_CHORES.forEach(chore => {
          const state = prev[chore.id];
          if (state?.lastCompleted) {
            const elapsed = Date.now() - state.lastCompleted.getTime();
            const remaining = (chore.cooldownMinutes * 60 * 1000) - elapsed;
            
            if (remaining <= 0 && state.isOnCooldown) {
              updated[chore.id] = { isOnCooldown: false, remainingTime: 0 };
              hasChanges = true;
            } else if (remaining > 0) {
              updated[chore.id] = { 
                ...state, 
                remainingTime: Math.ceil(remaining / 1000) 
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteChore = (chore: Chore) => {
    const state = choreStates[chore.id];
    if (state?.isOnCooldown) return;

    // Mark chore as completed
    setChoreStates(prev => ({
      ...prev,
      [chore.id]: {
        lastCompleted: new Date(),
        isOnCooldown: true,
        remainingTime: chore.cooldownMinutes * 60,
      },
    }));

    // Award money
    onCompleteChore(chore.reward, chore.id);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Earn Money
        </h3>
        <span className="text-sm text-muted-foreground">Complete chores to earn!</span>
      </div>

      <div className="grid gap-3">
        {AVAILABLE_CHORES.map((chore) => {
          const state = choreStates[chore.id];
          const isOnCooldown = state?.isOnCooldown || false;

          return (
            <div
              key={chore.id}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300",
                isOnCooldown 
                  ? "bg-muted/30 border-border opacity-60" 
                  : "bg-gradient-to-br from-mood-happy/10 to-mood-energetic/10 border-mood-happy/30 hover:border-mood-happy/50 hover:shadow-md"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chore.icon}</span>
                  <div>
                    <h4 className="font-display font-semibold text-foreground">
                      {chore.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chore.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-display font-bold text-primary text-lg">
                      +${chore.reward}
                    </div>
                    {isOnCooldown && state?.remainingTime && (
                      <div className="text-xs text-muted-foreground">
                        {formatTime(state.remainingTime)}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="earn"
                    size="sm"
                    onClick={() => handleCompleteChore(chore)}
                    disabled={isOnCooldown}
                    className={cn(
                      "min-w-[80px]",
                      isOnCooldown && "opacity-50"
                    )}
                  >
                    {isOnCooldown ? '⏳' : 'Do It!'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        💡 Tip: Chores have cooldowns, so manage your time wisely!
      </p>
    </div>
  );
}
