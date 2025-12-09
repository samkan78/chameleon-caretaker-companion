/**
 * FinancePanel Component
 * Displays financial information including balance, expenses, and savings goals
 * Shows recent transactions and spending by category
 */

import { PlayerFinances, Expense } from '@/types/pet';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FinancePanelProps {
  finances: PlayerFinances;
  className?: string;
}

const CATEGORY_ICONS: Record<Expense['category'], string> = {
  food: '🍎',
  toy: '🎾',
  health: '❤️',
  supplies: '📦',
  grooming: '✨',
};

const CATEGORY_COLORS: Record<Expense['category'], string> = {
  food: 'bg-stat-hunger/20 text-stat-hunger',
  toy: 'bg-stat-happiness/20 text-stat-happiness',
  health: 'bg-stat-health/20 text-stat-health',
  supplies: 'bg-primary/20 text-primary',
  grooming: 'bg-stat-cleanliness/20 text-stat-cleanliness',
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleDateString();
}

export function FinancePanel({ finances, className }: FinancePanelProps) {
  // Calculate spending by category
  const spendingByCategory = finances.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Expense['category'], number>);

  const savingsProgress = Math.min(100, (finances.balance / finances.savingsGoal) * 100);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Balance Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
          <span className="text-3xl">💰</span>
        </div>
        <div className="font-display text-4xl font-bold text-primary">
          ${finances.balance.toFixed(0)}
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Earned: </span>
            <span className="text-primary font-semibold">${finances.totalEarned}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Spent: </span>
            <span className="text-destructive font-semibold">${finances.totalSpent}</span>
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="p-4 rounded-xl bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-foreground">Savings Goal</span>
          <span className="text-sm text-muted-foreground">
            ${finances.balance} / ${finances.savingsGoal}
          </span>
        </div>
        <Progress 
          value={savingsProgress} 
          className="h-3"
          indicatorClassName="bg-gradient-to-r from-mood-happy to-mood-energetic"
        />
        {savingsProgress >= 100 && (
          <p className="mt-2 text-sm text-primary font-medium">
            🎉 Goal reached! Great job saving!
          </p>
        )}
      </div>

      {/* Spending by Category */}
      {Object.keys(spendingByCategory).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-display font-semibold text-foreground">Spending Breakdown</h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(spendingByCategory) as [Expense['category'], number][]).map(([category, amount]) => (
              <div 
                key={category}
                className={cn(
                  "p-3 rounded-xl flex items-center gap-2",
                  CATEGORY_COLORS[category]
                )}
              >
                <span className="text-xl">{CATEGORY_ICONS[category]}</span>
                <div>
                  <div className="text-xs capitalize opacity-80">{category}</div>
                  <div className="font-bold">${amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h4 className="font-display font-semibold text-foreground">Recent Expenses</h4>
        {finances.expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No expenses yet</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {finances.expenses.slice(0, 10).map((expense) => (
              <div 
                key={expense.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[expense.category]}</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {expense.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(expense.timestamp)}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-destructive">-${expense.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
