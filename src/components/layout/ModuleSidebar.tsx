import { useState } from 'react';
import { ChevronLeft, ChevronRight, Crown, Building, Settings, Laptop } from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { NavModule, UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';

interface ModuleSidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  userRole: UserRole;
}

const iconMap: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
};

export function ModuleSidebar({ activeModule, onModuleChange, userRole }: ModuleSidebarProps) {
  const filteredModules = NAV_MODULES.filter(module => 
    module.roles.includes(userRole)
  );

  return (
    <aside className="w-[72px] bg-background-secondary border-r border-border-industrial flex flex-col items-center py-4 gap-2">
      {filteredModules.map((module) => (
        <button
          key={module.id}
          onClick={() => onModuleChange(module.id)}
          className={cn(
            "w-12 h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300",
            activeModule === module.id
              ? "bg-transparent text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {iconMap[module.icon]}
          <span className="text-[9px] uppercase tracking-wider font-medium">
            {module.label}
          </span>
        </button>
      ))}
    </aside>
  );
}
