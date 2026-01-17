import { cn } from '@/lib/utils';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  actions?: {
    label: string;
    icon?: LucideIcon;
    variant?: 'primary' | 'outline';
    onClick?: () => void;
  }[];
}

export function PageHeader({
  title,
  titleAccent,
  subtitle,
  badge,
  action,
  actions
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold leading-none tracking-tight text-white">
          {title} {titleAccent && <span className="ml-1">{titleAccent}</span>}
        </h1>
        {subtitle && (
          <p className="text-[14px] text-muted-foreground mt-2 font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {badge && (
          <span className="px-3 py-1.5 text-[10px] font-black border border-primary/30 text-primary bg-primary/5 rounded flex items-center gap-3 shadow-lg shadow-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,85,0,0.5)]" />
            {badge}
          </span>
        )}

        {action && action}

        {actions?.map((actionItem, index) => {
          const Icon = actionItem.icon;
          return (
            <Button
              key={index}
              variant={actionItem.variant === 'primary' ? 'default' : 'outline'}
              className={cn(
                "text-sm font-semibold h-10 px-4 rounded transition-all duration-300",
                actionItem.variant === 'primary'
                  ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  : "border-border bg-white/5 text-muted-foreground hover:text-foreground hover:border-foreground"
              )}
              onClick={actionItem.onClick}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {actionItem.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
