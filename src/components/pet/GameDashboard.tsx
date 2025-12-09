/**
 * GameDashboard Component
 * Main game interface - compact, game-focused layout with minimal scrolling
 * Features tabbed navigation for all game features
 */

import { useState } from 'react';
import { GameState, VET_SERVICES, EVOLUTION_STAGES } from '@/types/pet';
import { Chameleon } from './Chameleon';
import { StatsDisplay } from './StatsDisplay';
import { ActionButtons } from './ActionButtons';
import { FinancePanel } from './FinancePanel';
import { ChoresPanel } from './ChoresPanel';
import { BadgesPanel } from './BadgesPanel';
import { TricksPanel } from './TricksPanel';
import { HealthcarePanel } from './HealthcarePanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameDashboardProps {
  gameState: GameState;
  onAction: (action: string) => boolean;
  onVetService: (serviceType: keyof typeof VET_SERVICES) => boolean;
  onEarnMoney: (amount: number, choreId: string) => void;
  onTeachTrick: (trickName: string) => boolean;
  onReset: () => void;
}

type Tab = 'care' | 'health' | 'money' | 'progress';

export function GameDashboard({
  gameState,
  onAction,
  onVetService,
  onEarnMoney,
  onTeachTrick,
  onReset,
}: GameDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('care');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'care', label: 'Care', icon: '❤️' },
    { id: 'health', label: 'Health', icon: '🩺' },
    { id: 'money', label: 'Money', icon: '💰' },
    { id: 'progress', label: 'Progress', icon: '⭐' },
  ];

  const stageInfo = EVOLUTION_STAGES[gameState.pet.evolutionStage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container max-w-5xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">🦎</span>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-sm text-foreground truncate">
                  {gameState.pet.name}
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  {stageInfo.name} • Day {gameState.pet.age + 1}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="font-display font-bold text-primary text-sm">
                  💰 ${gameState.finances.balance}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="text-muted-foreground hover:text-destructive h-8 px-2"
              >
                ↻
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Game Layout */}
      <main className="flex-1 container max-w-5xl mx-auto px-3 py-3">
        <div className="grid lg:grid-cols-5 gap-3 h-full">
          
          {/* Left Column - Pet & Stats (Compact) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Pet Display Card */}
            <div className="bg-card rounded-2xl shadow-card border border-border p-3 flex-shrink-0">
              <div 
                className="rounded-xl p-4 transition-all duration-700 flex items-center justify-center"
                style={{
                  background: `linear-gradient(180deg, ${gameState.pet.color}15 0%, ${gameState.pet.color}05 100%)`,
                  minHeight: '180px',
                }}
              >
                <Chameleon
                  mood={gameState.pet.mood}
                  color={gameState.pet.color}
                  name={gameState.pet.name}
                  type={gameState.pet.type}
                  evolutionStage={gameState.pet.evolutionStage}
                  reaction={gameState.pet.currentReaction}
                />
              </div>
              
              {/* Quick mood status */}
              <div className="mt-2 text-center">
                <span 
                  className="inline-block px-3 py-1 rounded-full font-display font-semibold text-xs capitalize"
                  style={{
                    backgroundColor: `${gameState.pet.color}20`,
                    color: gameState.pet.color,
                  }}
                >
                  {gameState.pet.mood === 'happy' && '😊 Happy'}
                  {gameState.pet.mood === 'sad' && '😢 Sad'}
                  {gameState.pet.mood === 'sick' && '🤒 Sick'}
                  {gameState.pet.mood === 'energetic' && '⚡ Energetic'}
                  {gameState.pet.mood === 'tired' && '😴 Tired'}
                  {gameState.pet.mood === 'neutral' && '😐 Okay'}
                  {gameState.pet.mood === 'hungry' && '🍽️ Hungry'}
                  {gameState.pet.mood === 'dirty' && '🫧 Needs Bath'}
                </span>
              </div>
            </div>

            {/* Stats Panel (Compact) */}
            <div className="bg-card rounded-2xl shadow-card border border-border p-3">
              <StatsDisplay stats={gameState.pet.stats} compact />
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-display font-semibold text-sm transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-2xl shadow-card border border-border p-4 flex-1 overflow-auto">
              {activeTab === 'care' && (
                <ActionButtons
                  onAction={onAction}
                  balance={gameState.finances.balance}
                />
              )}

              {activeTab === 'health' && (
                <HealthcarePanel
                  health={gameState.pet.stats.health}
                  balance={gameState.finances.balance}
                  vetHistory={gameState.pet.vetHistory}
                  lastVetVisit={gameState.pet.lastVetVisit}
                  onVetService={onVetService}
                />
              )}

              {activeTab === 'money' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <ChoresPanel onCompleteChore={onEarnMoney} />
                  <FinancePanel finances={gameState.finances} />
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-4">
                  <TricksPanel
                    learnedTricks={gameState.pet.tricks}
                    energy={gameState.pet.stats.energy}
                    onTeachTrick={onTeachTrick}
                  />
                  <div className="border-t border-border pt-4">
                    <BadgesPanel earnedBadges={gameState.badges} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Help */}
            <details className="bg-primary/5 rounded-xl border border-primary/20 p-3 shrink-0">
              <summary className="flex items-center justify-between cursor-pointer list-none text-sm">
                <span className="font-display font-semibold text-primary">📖 How to Play</span>
                <span className="text-primary text-xs">▼</span>
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="p-2 bg-card rounded-lg">
                  <span className="font-semibold text-foreground">❤️ Care:</span> Feed, play, clean
                </div>
                <div className="p-2 bg-card rounded-lg">
                  <span className="font-semibold text-foreground">🩺 Health:</span> Vet visits
                </div>
                <div className="p-2 bg-card rounded-lg">
                  <span className="font-semibold text-foreground">💰 Money:</span> Chores → earnings
                </div>
                <div className="p-2 bg-card rounded-lg">
                  <span className="font-semibold text-foreground">📈 Grow:</span> Stats → evolution
                </div>
              </div>
            </details>
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl border-2 border-border p-5 max-w-sm w-full animate-scale-in">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              Reset Game?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will delete all progress. This cannot be undone.
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

      {/* Minimal Footer */}
      <footer className="border-t border-border py-2 shrink-0">
        <p className="text-center text-[10px] text-muted-foreground">
          Virtual Chameleon Pet • FBLA 2025
        </p>
      </footer>
    </div>
  );
}
