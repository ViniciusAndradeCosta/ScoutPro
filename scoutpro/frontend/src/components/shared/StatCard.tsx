import { Card } from '../ui/card';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  gradient?: boolean;
  onClick?: () => void;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive = true,
  trend,
  subtitle,
  gradient = true,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`p-6 bg-card border-border hover:border-primary/50 transition-all ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              gradient
                ? 'bg-gradient-to-br from-primary to-accent'
                : 'bg-muted'
            }`}
          >
            <Icon className={`w-6 h-6 ${gradient ? 'text-background' : 'text-primary'}`} />
          </div>
          {change && (
            <div
              className={`text-xs px-2 py-1 rounded-lg font-medium ${
                positive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {change}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground/70">{subtitle}</div>
          )}
        </div>

        {trend && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  trend === 'up'
                    ? 'bg-accent'
                    : trend === 'down'
                    ? 'bg-destructive'
                    : 'bg-muted-foreground'
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {trend === 'up'
                  ? 'Crescimento'
                  : trend === 'down'
                  ? 'Declínio'
                  : 'Estável'}
              </span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
