/**
 * GameDashboard Component
 * Main game interface with pet centered, stats above, actions below
 * Designed as a game screen with minimal scrolling
 */

import { useState } from 'react';
import { GameState, ACTION_COSTS, AVAILABLE_CHORES, VET_SERVICES, OPTIMAL_TEMP, TEMP_RANGE } from '@/types/pet';
import { Chameleon } from './Chameleon';
import { StatsDisplay } from './StatsDisplay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Coins, RotateCcw, Sparkles, Heart, Utensils, Gamepad2, Bath, Moon, Stethoscope, Siren, Pill, Thermometer, Minus, Plus } from 'lucide-react';

export interface GameDashboardProps {
  gameState: GameState;
  onAction: (action: string) => boolean;
  onEarnMoney: (amount: number, choreId: string) => void;
  onVetService: (serviceType: 'checkup' | 'vaccination' | 'treatment' | 'emergency') => boolean;
  onTeachTrick: (trickName: string) => boolean;
  onSetTemperature: (temp: number) => void;
  onReset: () => void;
}

// Available tricks to teach
const AVAILABLE_TRICKS = [
  { name: 'Wave', icon: '👋', energy: 20 },
  { name: 'Spin', icon: '🔄', energy: 25 },
  { name: 'Color Flash', icon: '🌈', energy: 30 },
  { name: 'Tongue Catch', icon: '👅', energy: 20 },
  { name: 'Hide', icon: '🫥', energy: 15 },
];

export function GameDashboard({
  gameState,
  onAction,
  onEarnMoney,
  onVetService,
  onTeachTrick,
  onSetTemperature,
  onReset,
}: GameDashboardProps) {
  const { pet, finances, badges } = gameState;
  const [activeTab, setActiveTab] = useState<'care' | 'health' | 'earn' | 'tricks'>('care');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showTempControl, setShowTempControl] = useState(false);

  // Chore cooldown tracking
  const [choreCooldowns, setChoreCooldowns] = useState<Record<string, number>>({});

  const handleChore = (chore: typeof AVAILABLE_CHORES[0]) => {
    const now = Date.now();
    const lastDone = choreCooldowns[chore.id] || 0;
    const cooldownMs = chore.cooldownMinutes * 60 * 1000;
    
    if (now - lastDone < cooldownMs) return;
    
    onEarnMoney(chore.reward, chore.id);
    setChoreCooldowns(prev => ({ ...prev, [chore.id]: now }));
  };

  const getChoreTimeLeft = (chore: typeof AVAILABLE_CHORES[0]) => {
    const now = Date.now();
    const lastDone = choreCooldowns[chore.id] || 0;
    const cooldownMs = chore.cooldownMinutes * 60 * 1000;
    const timeLeft = Math.max(0, cooldownMs - (now - lastDone));
    return Math.ceil(timeLeft / 60000);
  };

  // Care actions configuration (removed temp since it has its own UI)
  const careActions = [
    { id: 'feed', icon: Utensils, label: 'Feed', cost: ACTION_COSTS.feed.cost },
    { id: 'treat', icon: Sparkles, label: 'Treat', cost: ACTION_COSTS.treat.cost },
    { id: 'play', icon: Gamepad2, label: 'Play', cost: ACTION_COSTS.play.cost },
    { id: 'clean', icon: Bath, label: 'Clean', cost: ACTION_COSTS.bath.cost },
  ];

  // Temperature status
  const currentTemp = pet.tankEnvironment.temperature;
  const isOptimalTemp = currentTemp >= OPTIMAL_TEMP.min && currentTemp <= OPTIMAL_TEMP.max;
  const tempStatus = currentTemp < OPTIMAL_TEMP.min ? 'cold' : currentTemp > OPTIMAL_TEMP.max ? 'hot' : 'optimal';

  // Health services
  const healthServices = [
    { id: 'checkup', service: VET_SERVICES.checkup, icon: Stethoscope },
    { id: 'treatment', service: VET_SERVICES.treatment, icon: Pill },
    { id: 'emergency', service: VET_SERVICES.emergency, icon: Siren },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col p-3 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background-dark)) 50%, hsl(var(--primary)/0.1) 100%)',
      }}
    >
      {/* Top Bar: Coins + Badges + Reset */}
      <div className="flex items-center justify-between mb-2">
        {/* Coins */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-display font-bold text-lg text-yellow-400">${finances.balance}</span>
        </div>

        {/* Badges count */}
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
          <span className="text-lg">🏆</span>
          <span className="font-semibold text-sm">{badges.length} badges</span>
        </div>

        {/* Reset */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Game?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">This will delete all progress. Are you sure?</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { onReset(); setShowResetDialog(false); }}>
                Reset Everything
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Bar */}
      <div className="mb-2">
        <StatsDisplay stats={pet.stats} />
      </div>

      {/* Center: Pet with Background */}
      <div 
        className="flex-1 flex items-center justify-center relative min-h-[200px] max-h-[320px] rounded-2xl mx-auto w-full max-w-md overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary)/0.15) 0%, transparent 70%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 text-2xl opacity-30 animate-float">🌿</div>
          <div className="absolute top-8 right-6 text-xl opacity-25 animate-float" style={{ animationDelay: '0.5s' }}>🍃</div>
          <div className="absolute bottom-8 left-8 text-lg opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌺</div>
          <div className="absolute bottom-4 right-4 text-xl opacity-25 animate-float" style={{ animationDelay: '0.3s' }}>🦋</div>
        </div>

        {/* Branch/perch */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-3 bg-gradient-to-r from-amber-800/60 via-amber-700/80 to-amber-800/60 rounded-full" />

        {/* Chameleon */}
        <Chameleon
          mood={pet.mood}
          color={pet.color}
          name={pet.name}
          type={pet.type}
          evolutionStage={pet.evolutionStage}
          reaction={pet.currentReaction}
          className="w-full max-w-[280px]"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 justify-center my-2">
        {(['care', 'health', 'earn', 'tricks'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {tab === 'care' && '🍎 Care'}
            {tab === 'health' && '💊 Health'}
            {tab === 'earn' && '💰 Earn'}
            {tab === 'tricks' && '🎪 Tricks'}
          </button>
        ))}
      </div>

      {/* Action Panel */}
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 p-3 min-h-[120px]">
        {/* Care Tab */}
        {activeTab === 'care' && (
          <div className="space-y-3">
            {/* Care action buttons */}
            <div className="grid grid-cols-5 gap-2">
              {careActions.map((action) => {
                const canAfford = finances.balance >= action.cost;
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => onAction(action.id)}
                    disabled={!canAfford && action.cost > 0}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      canAfford || action.cost === 0
                        ? 'bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95 border border-primary/20'
                        : 'bg-muted/30 opacity-50 cursor-not-allowed border border-muted/20'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-medium">{action.label}</span>
                    {action.cost > 0 && (
                      <span className="text-[9px] text-muted-foreground">${action.cost}</span>
                    )}
                  </button>
                );
              })}
              {/* Rest button */}
              <button
                onClick={() => onAction('rest')}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95 border border-primary/20"
              >
                <Moon className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-medium">Rest</span>
              </button>
            </div>

            {/* Temperature Control */}
            <div className={`flex items-center gap-3 p-2 rounded-xl border ${
              isOptimalTemp 
                ? 'bg-stat-health/10 border-stat-health/30' 
                : tempStatus === 'hot' 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-blue-500/10 border-blue-500/30'
            }`}>
              <Thermometer className={`w-5 h-5 ${
                isOptimalTemp ? 'text-stat-health' : tempStatus === 'hot' ? 'text-red-500' : 'text-blue-500'
              }`} />
              
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={() => onSetTemperature(currentTemp - 5)}
                  disabled={currentTemp <= TEMP_RANGE.min}
                  className="p-1 rounded-md bg-background/50 hover:bg-background/80 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTemp]}
                    min={TEMP_RANGE.min}
                    max={TEMP_RANGE.max}
                    step={1}
                    onValueChange={(value) => onSetTemperature(value[0])}
                    className="flex-1"
                  />
                </div>
                
                <button
                  onClick={() => onSetTemperature(currentTemp + 5)}
                  disabled={currentTemp >= TEMP_RANGE.max}
                  className="p-1 rounded-md bg-background/50 hover:bg-background/80 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-right min-w-[60px]">
                <span className={`font-bold text-sm ${
                  isOptimalTemp ? 'text-stat-health' : tempStatus === 'hot' ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {currentTemp}°F
                </span>
                <div className="text-[9px] text-muted-foreground">
                  {isOptimalTemp ? '✓ Optimal' : tempStatus === 'hot' ? '⚠ Hot' : '⚠ Cold'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-3 gap-2">
            {healthServices.map(({ id, service, icon: IconComponent }) => {
              const canAfford = finances.balance >= service.cost;
              return (
                <button
                  key={id}
                  onClick={() => onVetService(id as 'checkup' | 'treatment' | 'emergency')}
                  disabled={!canAfford}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    canAfford
                      ? 'bg-stat-health/10 hover:bg-stat-health/20 hover:scale-105 active:scale-95 border border-stat-health/30'
                      : 'bg-muted/30 opacity-50 cursor-not-allowed border border-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-stat-health" />
                    <span className="text-lg">{service.icon}</span>
                  </div>
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>${service.cost}</span>
                    <span className="text-stat-health">+{service.healthBoost} HP</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Earn Tab */}
        {activeTab === 'earn' && (
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_CHORES.slice(0, 6).map((chore) => {
              const timeLeft = getChoreTimeLeft(chore);
              const isReady = timeLeft === 0;
              return (
                <button
                  key={chore.id}
                  onClick={() => handleChore(chore)}
                  disabled={!isReady}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isReady
                      ? 'bg-yellow-500/10 hover:bg-yellow-500/20 hover:scale-105 active:scale-95 border border-yellow-500/30'
                      : 'bg-muted/30 opacity-60 cursor-not-allowed border border-muted/20'
                  }`}
                >
                  <span className="text-xl">{chore.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{chore.name}</span>
                  {isReady ? (
                    <span className="text-[10px] text-yellow-500 font-semibold">+${chore.reward}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{timeLeft}m</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tricks Tab */}
        {activeTab === 'tricks' && (
          <div className="space-y-2">
            <div className="flex gap-1 flex-wrap justify-center mb-2">
              {pet.tricks.length > 0 ? (
                pet.tricks.map((trick) => (
                  <span
                    key={trick}
                    className="px-2 py-0.5 bg-primary/20 rounded-full text-xs font-medium text-primary"
                  >
                    ✓ {trick}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No tricks learned yet</span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_TRICKS.map((trick) => {
                const isLearned = pet.tricks.includes(trick.name);
                const hasEnergy = pet.stats.energy >= trick.energy;
                return (
                  <button
                    key={trick.name}
                    onClick={() => onTeachTrick(trick.name)}
                    disabled={isLearned || !hasEnergy}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      isLearned
                        ? 'bg-primary/20 border border-primary/40'
                        : hasEnergy
                        ? 'bg-accent/10 hover:bg-accent/20 hover:scale-105 active:scale-95 border border-accent/30'
                        : 'bg-muted/30 opacity-50 cursor-not-allowed border border-muted/20'
                    }`}
                  >
                    <span className="text-lg">{trick.icon}</span>
                    <span className="text-[10px] font-medium text-center">{trick.name}</span>
                    {!isLearned && (
                      <span className="text-[9px] text-muted-foreground">⚡{trick.energy}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Spent tracker */}
      <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span>Total Spent: ${finances.totalSpent}</span>
        <span>•</span>
        <span>Total Earned: ${finances.totalEarned}</span>
      </div>
    </div>
  );
}
