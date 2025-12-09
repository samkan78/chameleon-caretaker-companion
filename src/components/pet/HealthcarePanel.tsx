/**
 * HealthcarePanel Component
 * Displays vet services, health history, and medical care options
 * Tracks vaccination and treatment schedules
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VET_SERVICES, VetRecord } from '@/types/pet';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface HealthcarePanelProps {
  health: number;
  balance: number;
  vetHistory: VetRecord[];
  lastVetVisit?: Date;
  onVetService: (serviceType: keyof typeof VET_SERVICES) => boolean;
}

export function HealthcarePanel({
  health,
  balance,
  vetHistory,
  lastVetVisit,
  onVetService,
}: HealthcarePanelProps) {
  const [selectedService, setSelectedService] = useState<keyof typeof VET_SERVICES | null>(null);

  const services = Object.entries(VET_SERVICES) as [keyof typeof VET_SERVICES, typeof VET_SERVICES[keyof typeof VET_SERVICES]][];

  // Get health status message
  const getHealthStatus = () => {
    if (health >= 80) return { text: 'Excellent Health', color: 'text-stat-health', bg: 'bg-stat-health/10' };
    if (health >= 60) return { text: 'Good Health', color: 'text-primary', bg: 'bg-primary/10' };
    if (health >= 40) return { text: 'Fair Health', color: 'text-stat-hunger', bg: 'bg-stat-hunger/10' };
    if (health >= 20) return { text: 'Poor Health', color: 'text-destructive', bg: 'bg-destructive/10' };
    return { text: 'Critical!', color: 'text-destructive', bg: 'bg-destructive/20' };
  };

  const status = getHealthStatus();

  return (
    <div className="space-y-4">
      {/* Health Status Card */}
      <div className={cn("p-4 rounded-2xl border-2", status.bg, "border-current/20")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Health</p>
            <p className={cn("font-display font-bold text-xl", status.color)}>
              {health}% - {status.text}
            </p>
          </div>
          <div className="text-4xl">
            {health >= 80 ? '💚' : health >= 60 ? '💛' : health >= 40 ? '🧡' : '❤️‍🩹'}
          </div>
        </div>
        {lastVetVisit && (
          <p className="text-xs text-muted-foreground mt-2">
            Last vet visit: {formatDistanceToNow(lastVetVisit, { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Vet Services Grid */}
      <div>
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">
          🏥 Veterinary Services
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {services.map(([key, service]) => {
            const canAfford = balance >= service.cost;
            const isSelected = selectedService === key;

            return (
              <button
                key={key}
                onClick={() => {
                  if (canAfford) {
                    setSelectedService(isSelected ? null : key);
                  }
                }}
                disabled={!canAfford}
                className={cn(
                  "relative p-3 rounded-xl border-2 text-left transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  isSelected
                    ? "border-stat-health bg-stat-health/10"
                    : "border-border bg-muted/30 hover:border-stat-health/50"
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{service.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-foreground truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className={cn(
                    "font-bold px-2 py-0.5 rounded-full",
                    canAfford ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  )}>
                    ${service.cost}
                  </span>
                  <span className="text-stat-health font-semibold">
                    +{service.healthBoost} HP
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm button when service selected */}
      {selectedService && (
        <Button
          onClick={() => {
            const success = onVetService(selectedService);
            if (success) setSelectedService(null);
          }}
          variant="care"
          className="w-full animate-fade-in-up"
        >
          {VET_SERVICES[selectedService].icon} Book {VET_SERVICES[selectedService].name} - ${VET_SERVICES[selectedService].cost}
        </Button>
      )}

      {/* Recent Vet History */}
      {vetHistory.length > 0 && (
        <div>
          <h4 className="font-display font-semibold text-sm text-foreground mb-2">
            📋 Recent Visits
          </h4>
          <div className="space-y-1.5 max-h-28 overflow-y-auto">
            {vetHistory.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{VET_SERVICES[record.type]?.icon || '🩺'}</span>
                  <span className="text-foreground font-medium">{record.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stat-health">+{record.healthBoost}</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(record.date, { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Tips */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">💡 Tip:</span> Regular checkups prevent health issues. 
          Keep hunger and cleanliness high to maintain good health!
        </p>
      </div>
    </div>
  );
}
