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
        <h1 className="text-3xl font-bold tracking-tight uppercase italic">
          <span className="text-foreground">{title}</span>
          {titleAccent && (
            <span className="text-primary ml-2">{titleAccent}</span>
          )}
        </h1>
        {subtitle && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {badge && (
          <span className="px-3 py-1.5 text-xs uppercase tracking-wider border border-primary text-primary rounded-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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
                "uppercase tracking-wider text-xs font-semibold",
                action.variant === 'primary' 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "border-border-industrial text-muted-foreground hover:text-foreground hover:border-foreground"
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
