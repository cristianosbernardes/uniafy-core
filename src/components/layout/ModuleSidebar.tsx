import {
  ChevronsRight,
  LayoutDashboard,
  Building2,
  Activity,
  Settings2,
  LayoutGrid,
  ListChecks,
  Users,
  Timer,
  RefreshCw,
  FolderOpen,
  Palette
} from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from './UserProfile';

interface ModuleSidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  userRole: UserRole;
  isContextOpen: boolean;
  onToggleContext: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Settings2: <Settings2 className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  ListChecks: <ListChecks className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Timer: <Timer className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  FolderOpen: <FolderOpen className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
};

export function ModuleSidebar({
  activeModule,
  onModuleChange,
  userRole,
  isContextOpen,
  onToggleContext
}: ModuleSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only show modules the user has access to
  const availableModules = NAV_MODULES.filter(module =>
    module.items.some(item => item.roles.includes(userRole))
  );

  return (
    <nav
      className={cn(
        "w-full h-full flex flex-col items-center py-2 relative z-50 transition-colors duration-300",
        // No background here, handled by parent container via CSS var
      )}
    >
      {/* 
        ClickUp Style Expand Trigger 
      */}
      {!isContextOpen && (
        <div className="w-full flex flex-col items-center mb-1 animate-in fade-in duration-300">
          <button
            onClick={onToggleContext}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all mb-1 group"
            title="Expandir Submenu"
          >
            <ChevronsRight className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>

          <div className="w-8 h-[1px] bg-white/5" />
        </div>
      )}

      {/* Navigation Items - No Logo here anymore */}
      <div className="flex-1 w-full flex flex-col gap-1.5 items-center pt-1">
        {availableModules.map((module) => {
          const isActive = activeModule === module.id;
          const IconNode = iconMap[module.icon] || <LayoutDashboard className="w-5 h-5" />;

          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className="group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 gap-1"
              title={module.label}
            >
              {/* 
                Icon Wrapper: 32x32 (w-8 h-8) 
                Holds the background color when active 
              */}
              <div className={cn(
                "relative z-10 w-8 h-8 rounded-[9px] flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/40"
                  : "bg-transparent text-[var(--header-icon-color,rgba(255,255,255,0.8))] group-hover:text-white group-hover:bg-white/5"
              )}>
                {IconNode}
              </div>

              <span
                className={cn(
                  "font-bold tracking-wide leading-none transition-colors",
                  isActive ? "text-white" : "text-white/80 group-hover:text-white"
                )}
                style={{ fontSize: 'var(--fs-menu, 10px)' }}
              >
                {module.label}
              </span>

              {/* Active Indicator Removed for Cleaner Look */}
            </button>
          );
        })}
      </div>

      {/* User Profile at Bottom (Re-added if needed, or kept clean) */}
      <div className="mt-auto mb-4">
        <UserProfile showLabel={false} />
      </div>
    </nav>
  );
}
