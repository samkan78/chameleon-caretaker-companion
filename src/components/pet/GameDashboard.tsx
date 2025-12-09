/**
 * GameDashboard Component
 * Main game interface showing pet, stats, actions, and management panels
 * Organized into logical sections for easy navigation
 */

import { useState } from 'react';
import { GameState } from '@/types/pet';
import { Chameleon } from './Chameleon';
import { StatsDisplay } from './StatsDisplay';
import { ActionButtons } from './ActionButtons';
import { FinancePanel } from './FinancePanel';
import { ChoresPanel } from './ChoresPanel';
import { BadgesPanel } from './BadgesPanel';
import { TricksPanel } from './TricksPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameDashboardProps {
  gameState: GameState;
  onAction: (action: string) => boolean;
  onEarnMoney: (amount: number, choreId: string) => void;
  onTeachTrick: (trickName: string) => boolean;
  onReset: () => void;
}

type Tab = 'care' | 'money' | 'tricks' | 'badges';

export function GameDashboard({
  gameState,
  onAction,
  onEarnMoney,
  onTeachTrick,
  onReset,
}: GameDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('care');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'care', label: 'Care', icon: '❤️' },
    { id: 'money', label: 'Money', icon: '💰' },
    { id: 'tricks', label: 'Tricks', icon: '🎪' },
    { id: 'badges', label: 'Badges', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦎</span>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">
                  {gameState.pet.name}
                </h1>
                <p className="text-xs text-muted-foreground capitalize">
                  Feeling {gameState.pet.mood}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="font-display font-bold text-primary">
                  💰 ${gameState.finances.balance}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="text-muted-foreground hover:text-destructive"
              >
                ↻ Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Pet Display & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pet Display */}
            <div className="bg-card rounded-3xl shadow-card border-2 border-border p-6 overflow-hidden">
              <div 
                className="rounded-2xl p-6 transition-all duration-700"
                style={{
                  background: `linear-gradient(180deg, ${gameState.pet.color}15 0%, ${gameState.pet.color}05 100%)`,
                }}
              >
                <Chameleon
                  mood={gameState.pet.mood}
                  color={gameState.pet.color}
                  name={gameState.pet.name}
                />
              </div>
              
              {/* Quick mood indicator */}
              <div className="mt-4 text-center">
                <span 
                  className="inline-block px-4 py-2 rounded-full font-display font-semibold text-sm capitalize"
                  style={{
                    backgroundColor: `${gameState.pet.color}20`,
                    color: gameState.pet.color,
                  }}
                >
                  {gameState.pet.mood === 'happy' && '😊 Happy & Content'}
                  {gameState.pet.mood === 'sad' && '😢 Needs Attention'}
                  {gameState.pet.mood === 'sick' && '🤒 Not Feeling Well'}
                  {gameState.pet.mood === 'energetic' && '⚡ Full of Energy'}
                  {gameState.pet.mood === 'tired' && '😴 Needs Rest'}
                  {gameState.pet.mood === 'neutral' && '😐 Doing Okay'}
                </span>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-card rounded-3xl shadow-card border-2 border-border p-6">
              <StatsDisplay stats={gameState.pet.stats} />
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-card shadow-md text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-3xl shadow-card border-2 border-border p-6 animate-fade-in-up">
              {activeTab === 'care' && (
                <ActionButtons
                  onAction={onAction}
                  balance={gameState.finances.balance}
                />
              )}

              {activeTab === 'money' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <ChoresPanel onCompleteChore={onEarnMoney} />
                  <FinancePanel finances={gameState.finances} />
                </div>
              )}

              {activeTab === 'tricks' && (
                <TricksPanel
                  learnedTricks={gameState.pet.tricks}
                  energy={gameState.pet.stats.energy}
                  onTeachTrick={onTeachTrick}
                />
              )}

              {activeTab === 'badges' && (
                <BadgesPanel earnedBadges={gameState.badges} />
              )}
            </div>

            {/* Help Section */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-display font-semibold text-primary">
                    📖 How to Play
                  </span>
                  <span className="text-primary group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-card rounded-xl">
                      <h4 className="font-semibold text-foreground mb-1">🎯 Goal</h4>
                      <p>Keep your chameleon happy and healthy while managing expenses responsibly.</p>
                    </div>
                    <div className="p-3 bg-card rounded-xl">
                      <h4 className="font-semibold text-foreground mb-1">❤️ Care</h4>
                      <p>Use the Care tab to feed, play, rest, clean, and provide medical care.</p>
                    </div>
                    <div className="p-3 bg-card rounded-xl">
                      <h4 className="font-semibold text-foreground mb-1">💰 Money</h4>
                      <p>Complete chores to earn money for pet care. Track your spending!</p>
                    </div>
                    <div className="p-3 bg-card rounded-xl">
                      <h4 className="font-semibold text-foreground mb-1">🎨 Colors</h4>
                      <p>Watch your chameleon change colors based on its mood!</p>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card rounded-2xl shadow-xl border-2 border-border p-6 max-w-sm w-full animate-scale-in">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              Reset Game?
            </h3>
            <p className="text-muted-foreground mb-6">
              This will delete all progress including your pet, money, and badges. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="subtle"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Virtual Chameleon Pet • FBLA Introduction to Programming 2025
        </p>
      </footer>
    </div>
  );
}
