/**
 * WelcomeScreen Component
 * Initial screen for naming and choosing chameleon type
 * Game-focused onboarding with species selection
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChameleonType, CHAMELEON_TYPES } from '@/types/pet';

interface WelcomeScreenProps {
  onStart: (name: string, type: ChameleonType) => boolean;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [petName, setPetName] = useState('');
  const [selectedType, setSelectedType] = useState<ChameleonType>('veiled');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'type' | 'name'>('type');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = petName.trim();
    
    if (!trimmedName) {
      setError('Please enter a name for your chameleon');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
      setError('Name can only contain letters, numbers, and spaces');
      return;
    }

    setIsLoading(true);
    const success = onStart(trimmedName, selectedType);
    if (!success) {
      setIsLoading(false);
    }
  };

  const typeEntries = Object.entries(CHAMELEON_TYPES) as [ChameleonType, typeof CHAMELEON_TYPES[ChameleonType]][];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block text-6xl mb-3 animate-float">🦎</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
            Virtual Chameleon
          </h1>
          <p className="text-muted-foreground">
            Choose your companion & start your adventure!
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl shadow-card border-2 border-border p-6">
          {step === 'type' ? (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground text-center">
                Choose Your Chameleon
              </h2>

              <div className="grid gap-3">
                {typeEntries.map(([typeKey, typeInfo]) => (
                  <button
                    key={typeKey}
                    onClick={() => setSelectedType(typeKey)}
                    className={cn(
                      "relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      selectedType === typeKey
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-muted/30 hover:border-primary/50"
                    )}
                  >
                    {/* Preview chameleon */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: `${typeInfo.baseColor}20` }}
                    >
                      <svg viewBox="0 0 60 50" className="w-12 h-12">
                        <ellipse cx="30" cy="30" rx="18" ry="12" fill={typeInfo.baseColor} />
                        <ellipse cx="45" cy="25" rx="10" ry="8" fill={typeInfo.baseColor} />
                        <circle cx="48" cy="23" r="5" fill="white" />
                        <circle cx="49" cy="24" r="2" fill="#1a1a2e" />
                        {typeKey === 'jackson' && (
                          <>
                            <path d="M45 15 L44 8 L47 16" fill={typeInfo.baseColor} />
                            <path d="M50 13 L52 6 L53 14" fill={typeInfo.baseColor} />
                          </>
                        )}
                        <path
                          d="M12 35 Q5 35 5 28 Q5 22 12 22 Q18 22 18 27"
                          fill="none"
                          stroke={typeInfo.baseColor}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <span className="font-display font-semibold text-foreground">
                          {typeInfo.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{typeInfo.description}</p>
                    </div>

                    {/* Selection indicator */}
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      selectedType === typeKey
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}>
                      {selectedType === typeKey && <span className="text-sm">✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setStep('name')}
                variant="action"
                size="lg"
                className="w-full"
              >
                Continue →
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep('type')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to type selection
              </button>

              {/* Selected type preview */}
              <div 
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: `${CHAMELEON_TYPES[selectedType].baseColor}15` }}
              >
                <span className="text-2xl">{CHAMELEON_TYPES[selectedType].icon}</span>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">
                    {CHAMELEON_TYPES[selectedType].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CHAMELEON_TYPES[selectedType].description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="petName" className="block font-display font-semibold text-foreground">
                  Name Your Chameleon
                </label>
                <Input
                  id="petName"
                  type="text"
                  value={petName}
                  onChange={(e) => {
                    setPetName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter a name..."
                  maxLength={20}
                  autoFocus
                  className={cn(
                    "h-12 text-lg rounded-xl border-2 focus:ring-2 focus:ring-primary/20",
                    error && "border-destructive focus:ring-destructive/20"
                  )}
                />
                {error && (
                  <p className="text-sm text-destructive animate-fade-in-up">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">{petName.length}/20 characters</p>
              </div>

              <Button
                type="submit"
                variant="action"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Hatching...' : 'Hatch Your Chameleon! 🥚'}
              </Button>
            </form>
          )}

          {/* Quick features */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {['🍎 Feed & Care', '🎾 Play', '💰 Earn', '📈 Grow', '🩺 Vet Visits', '🎪 Tricks'].map((f, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Virtual Chameleon Pet • FBLA Introduction to Programming 2025
        </p>
      </div>
    </div>
  );
}
