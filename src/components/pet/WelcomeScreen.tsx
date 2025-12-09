/**
 * WelcomeScreen Component
 * Initial screen for naming and customizing the new pet
 * Provides instructions and onboarding for new players
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onStart: (name: string) => boolean;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [petName, setPetName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input validation
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

    // Check for invalid characters (only allow letters, numbers, spaces)
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
      setError('Name can only contain letters, numbers, and spaces');
      return;
    }

    setIsLoading(true);
    const success = onStart(trimmedName);
    if (!success) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block text-7xl mb-4 animate-float">
            🦎
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            Virtual Chameleon
          </h1>
          <p className="text-lg text-muted-foreground">
            Your new colorful companion awaits!
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl shadow-card border-2 border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="petName" 
                className="block font-display font-semibold text-foreground"
              >
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
                className={cn(
                  "h-14 text-lg rounded-xl border-2 focus:ring-2 focus:ring-primary/20",
                  error && "border-destructive focus:ring-destructive/20"
                )}
                aria-describedby={error ? "name-error" : undefined}
              />
              {error && (
                <p id="name-error" className="text-sm text-destructive animate-fade-in-up">
                  {error}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {petName.length}/20 characters
              </p>
            </div>

            <Button
              type="submit"
              variant="action"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Start Your Adventure! 🌟'}
            </Button>
          </form>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-display font-semibold text-foreground mb-4 text-center">
              What You Can Do
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: '🍎', text: 'Feed & care for your pet' },
                { icon: '🎾', text: 'Play games together' },
                { icon: '💰', text: 'Manage pet expenses' },
                { icon: '⭐', text: 'Earn badges & rewards' },
                { icon: '🎨', text: 'Watch colors change with mood' },
                { icon: '🎪', text: 'Teach cool tricks' },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <span>{feature.icon}</span>
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <h4 className="font-display font-semibold text-primary mb-2">
            📖 How to Play
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep your pet happy by meeting its needs</li>
            <li>• Complete chores to earn money for pet care</li>
            <li>• Watch your chameleon change colors based on mood</li>
            <li>• Earn badges by reaching special milestones</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Virtual Chameleon Pet • FBLA Introduction to Programming 2025
        </p>
      </div>
    </div>
  );
}
