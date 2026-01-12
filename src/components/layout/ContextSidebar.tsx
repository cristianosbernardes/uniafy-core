import { useState } from 'react';
import {
  ChevronLeft,
  Building2,
  Activity,
  Settings2,
  LayoutGrid,
  ListChecks,
  Users,
  Timer,
  RefreshCw,
  LayoutDashboard,
  Radio,
  MessageSquare,
  BarChart3,
  Brain,
  Megaphone,
  Calendar,
  Target,
  PieChart,
  Radar,
  Eye,
  User,
  Zap,
  Bell,
  CreditCard,
  Palette,
  Brush,
  Database,
  Search,
  Globe,
  CheckCircle2,
  HeartPulse,
  Share2,
  Building,
  Crown,
  Laptop
} from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { NavItem, UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface ContextSidebarProps {
  activeModule: string;
  userRole: UserRole;
}

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Settings2: <Settings2 className="w-4 h-4" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  ListChecks: <ListChecks className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  Megaphone: <Megaphone className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
  Radar: <Radar className="w-4 h-4" />,
  Eye: <Eye className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Brush: <Brush className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Crown: <Crown className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
};

export function ContextSidebar({ activeModule, userRole }: ContextSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentModule = NAV_MODULES.find(m => m.id === activeModule);
  const items = currentModule?.items.filter(item => item.roles.includes(userRole)) || [];

  return (
    <aside
      className={cn(
        "bg-background-secondary border-r border-border-industrial transition-all duration-500 flex flex-col",
        isCollapsed ? "w-[56px]" : "w-[290px]"
      )}
    >
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border-industrial">
        {!isCollapsed && (
          <span className="text-xs uppercase tracking-widest text-muted-foreground italic">
            {activeModule.toUpperCase()}_CONTEXTO
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-3 rounded-md transition-all duration-300 text-left",
                isActive
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : "hover:bg-accent border-l-2 border-l-transparent"
              )}
            >
              <span className={cn(
                "mt-0.5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {iconMap[item.icon]}
              </span>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
