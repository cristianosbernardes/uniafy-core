import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, BarChart3, Wifi } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  status?: 'sync' | 'pending' | 'error';
  variant?: 'default' | 'currency' | 'percentage' | 'status';
  icon?: 'dollar' | 'trending' | 'chart' | 'wifi';
}

const iconMap = {
  dollar: DollarSign,
  trending: TrendingUp,
  chart: BarChart3,
  wifi: Wifi,
};

export function KPICard({
  label,
  value,
  change,
  status = 'sync',
  variant = 'default',
  icon
}: KPICardProps) {
  const Icon = icon ? iconMap[icon] : null;

  const getStatusLabel = () => {
    switch (status) {
      case 'sync':
        return 'SYNC_OK';
      case 'pending':
        return 'PENDING';
      case 'error':
        return 'ERROR';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sync':
        return 'text-muted-foreground';
      case 'pending':
        return 'text-uniafy-warning';
      case 'error':
        return 'text-uniafy-danger';
    }
  };

  return (
    <div className="card-industrial p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground mr-auto">{label}</span>
        {Icon && (
          <Icon className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-2xl font-bold",
          variant === 'status' ? "text-foreground" : "text-foreground"
        )}>
          {value}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span className={cn(
            "font-medium",
            change >= 0 ? "text-uniafy-success" : "text-uniafy-danger"
          )}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
        <span className={getStatusColor()}>
          {getStatusLabel()}
        </span>
      </div>
    </div>
  );
}
