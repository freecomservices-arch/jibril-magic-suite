import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'primary' | 'accent' | 'warning';
}

const variantClasses = {
  default: 'bg-card border border-border',
  primary: 'bg-primary/10 border border-primary/20',
  accent: 'bg-accent/10 border border-accent/20',
  warning: 'bg-warning/10 border border-warning/20',
};

const iconVariantClasses = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) => {
  return (
    <div className={`rounded-lg p-5 card-shadow animate-fade-in ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold font-heading text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 flex items-center text-xs font-medium ${trend.positive ? 'text-success' : 'text-destructive'}`}>
              <span>{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1 text-muted-foreground">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${iconVariantClasses[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
