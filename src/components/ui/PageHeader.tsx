import { cn } from '@/lib/utils';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  badge?: string;
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
  actions
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-black leading-none uppercase">
          <span className="text-foreground">{title}</span>
          {titleAccent && (
            <span className="text-primary ml-3">{titleAccent}</span>
          )}
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

        {actions?.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant === 'primary' ? 'default' : 'outline'}
              className={cn(
                "text-[11px] font-black h-10 px-6 rounded transition-all duration-300",
                action.variant === 'primary'
                  ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                  : "border-border bg-white/5 text-muted-foreground hover:text-foreground hover:border-foreground"
              )}
              onClick={action.onClick}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
