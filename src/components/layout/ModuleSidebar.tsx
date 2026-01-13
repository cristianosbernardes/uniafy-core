import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Settings,
  Radar,
  Brain,
  BarChart3,
  Handshake,
  Database,
  Globe,
  LayoutGrid,
  LogOut,
  Building,
  Laptop,
  LayoutDashboard
} from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { NavModule, UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleSidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  userRole: UserRole;
  isExpanded: boolean;
  onExpand: (expanded: boolean) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Radar: <Radar className="w-4 h-4" />,
  Handshake: <Handshake className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />, // Adicionado para módulo Client Success
};

export function ModuleSidebar({ activeModule, onModuleChange, userRole, isExpanded, onExpand }: ModuleSidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const filteredModules = NAV_MODULES.filter(module =>
    module.roles.includes(userRole)
  );

  const handleModuleClick = (module: NavModule) => {
    onModuleChange(module.id);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside
      onMouseEnter={() => onExpand(true)}
      onMouseLeave={() => onExpand(false)}
      className={cn(
        "h-[calc(100vh-64px)] bg-card border-r border-border transition-all duration-300 group/sidebar overflow-hidden flex flex-col z-40 fixed top-16 left-0",
        isExpanded ? "w-[280px]" : "w-[64px]"
      )}
    // Removed CSS variable from here since it's now handled by DashboardShell container
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="flex-1 py-6 px-3 flex flex-col gap-2 relative z-10 overflow-x-hidden overflow-y-auto">
        {filteredModules.map((module) => {
          const isActive = activeModule === module.id;
          const Icon = iconMap[module.icon] || <LayoutGrid className="w-4 h-4" />;

          return (
            <div key={module.id} className="relative group/module">
              <button
                onClick={() => handleModuleClick(module)}
                className={cn(
                  "group/btn w-full flex items-center gap-4 p-1 rounded transition-all duration-300 relative min-h-[56px]",
                  isActive
                    ? "bg-white/5 border border-white/10 text-primary shadow-xl"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                )}
              >
                <div className={cn(
                  "p-3 transition-all duration-300 relative z-10 flex items-center justify-center shrink-0",
                  isActive
                    ? "text-primary drop-shadow-[0_0_8px_rgba(255,85,0,0.5)]"
                    : "text-muted-foreground group-hover/btn:text-foreground"
                )}>
                  {Icon}
                </div>

                <div className="flex flex-col items-start overflow-hidden">
                  <span className={cn(
                    "text-[13px] font-bold whitespace-nowrap transition-all duration-500 tracking-wider", // Removed uppercase
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {module.label}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 relative z-10">
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-4 p-3 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300",
            !isExpanded && "justify-center"
          )}
          title="Sair do Sistema"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isExpanded && (
            <span className="text-[13px] font-bold tracking-wider whitespace-nowrap"> {/* Removed uppercase */}
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
