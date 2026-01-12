import { Info } from 'lucide-react';
import { Button } from './button';

interface IAProtocolCardProps {
  version: string;
  title: string;
  titleAccent?: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
}

export function IAProtocolCard({
  version,
  title,
  titleAccent,
  description,
  primaryAction,
  secondaryAction
}: IAProtocolCardProps) {
  return (
    <div className="card-industrial p-6 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
          <text x="50" y="55" textAnchor="middle" fontSize="60" fontWeight="bold" className="text-muted-foreground">
            U
          </text>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-industrial bg-background/50 mb-4">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            IA EXPERT PROTOCOL
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold uppercase tracking-tight mb-3">
          <span className="text-foreground">{title}</span>
          {titleAccent && (
            <span className="text-primary ml-2">{titleAccent}</span>
          )}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            V{version}
          </span>
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground uppercase tracking-wide leading-relaxed mb-6 max-w-2xl">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {primaryAction && (
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-semibold"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline"
              className="border-border-industrial text-muted-foreground hover:text-foreground hover:border-foreground uppercase tracking-wider text-xs font-semibold"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
