/**
 * TricksPanel Component
 * Allows players to teach their pet new tricks
 * Shows learned tricks and available tricks to learn
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TricksPanelProps {
  learnedTricks: string[];
  energy: number;
  onTeachTrick: (trickName: string) => boolean;
  className?: string;
}

const AVAILABLE_TRICKS = [
  { id: 'wave', name: 'Wave', icon: '👋', description: 'Wave hello!' },
  { id: 'spin', name: 'Spin', icon: '🌀', description: 'Do a full spin' },
  { id: 'dance', name: 'Dance', icon: '💃', description: 'Bust a move' },
  { id: 'hide', name: 'Hide', icon: '🙈', description: 'Blend in with surroundings' },
  { id: 'jump', name: 'Jump', icon: '⬆️', description: 'Jump high' },
  { id: 'tongue', name: 'Tongue Catch', icon: '👅', description: 'Catch flies with tongue' },
];

export function TricksPanel({ learnedTricks, energy, onTeachTrick, className }: TricksPanelProps) {
  const [isTeaching, setIsTeaching] = useState(false);

  const handleTeach = (trickName: string) => {
    setIsTeaching(true);
    setTimeout(() => {
      onTeachTrick(trickName);
      setIsTeaching(false);
    }, 500);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Tricks
        </h3>
        <span className="text-sm text-muted-foreground">
          {learnedTricks.length} / {AVAILABLE_TRICKS.length} learned
        </span>
      </div>

      {energy < 30 && (
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-sm text-accent">
          ⚠️ Your pet is too tired to learn new tricks. Let them rest first!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AVAILABLE_TRICKS.map((trick) => {
          const isLearned = learnedTricks.includes(trick.name);

          return (
            <div
              key={trick.id}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all duration-300",
                isLearned 
                  ? "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40" 
                  : "bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "text-3xl mb-2",
                isLearned && "animate-bounce-soft"
              )}>
                {trick.icon}
              </div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {trick.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {trick.description}
              </p>
              
              {isLearned ? (
                <span className="inline-block mt-2 text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                  ✓ Learned
                </span>
              ) : (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => handleTeach(trick.name)}
                  disabled={energy < 30 || isTeaching}
                  className="mt-2"
                >
                  {isTeaching ? '...' : 'Teach'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
