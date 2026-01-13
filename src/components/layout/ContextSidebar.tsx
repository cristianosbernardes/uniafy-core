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
  ChevronRight,
  Database,
  Search,
  FileText,
  HeartPulse,
  Rocket,
  Wallet,
  PenTool,
  Microscope,
  Globe
} from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { NavItem, UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface ContextSidebarProps {
  activeModule: string;
  userRole: UserRole;
}

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-3 h-3" />,
  Activity: <Activity className="w-3 h-3" />,
  Settings2: <Settings2 className="w-3 h-3" />,
  LayoutGrid: <LayoutGrid className="w-3 h-3" />,
  ListChecks: <ListChecks className="w-3 h-3" />,
  Users: <Users className="w-3 h-3" />,
  Timer: <Timer className="w-3 h-3" />,
  RefreshCw: <RefreshCw className="w-3 h-3" />,
  LayoutDashboard: <LayoutDashboard className="w-3 h-3" />,
  Radio: <Radio className="w-3 h-3" />,
  MessageSquare: <MessageSquare className="w-3 h-3" />,
  BarChart3: <BarChart3 className="w-3 h-3" />,
  Brain: <Brain className="w-3 h-3" />,
  Megaphone: <Megaphone className="w-3 h-3" />,
  Calendar: <Calendar className="w-3 h-3" />,
  Target: <Target className="w-3 h-3" />,
  PieChart: <PieChart className="w-3 h-3" />,
  Radar: <Radar className="w-3 h-3" />,
  Eye: <Eye className="w-3 h-3" />,
  User: <User className="w-3 h-3" />,
  Zap: <Zap className="w-3 h-3" />,
  Bell: <Bell className="w-3 h-3" />,
  CreditCard: <CreditCard className="w-3 h-3" />,
  Palette: <Palette className="w-3 h-3" />,
  Brush: <Brush className="w-3 h-3" />,
  Database: <Database className="w-3 h-3" />,
  Search: <Search className="w-3 h-3" />,
  FileText: <FileText className="w-3 h-3" />,
  HeartPulse: <HeartPulse className="w-3 h-3" />,
  Rocket: <Rocket className="w-3 h-3" />,
  Wallet: <Wallet className="w-3 h-3" />,
  PenTool: <PenTool className="w-3 h-3" />,
  Microscope: <Microscope className="w-3 h-3" />,
  Globe: <Globe className="w-3 h-3" />,
};

export function ContextSidebar({ activeModule, userRole }: ContextSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentModule = NAV_MODULES.find(m => m.id === activeModule);
  const items = currentModule?.items.filter(item => item.roles.includes(userRole)) || [];

  return (
    <aside className={cn(
      "h-[calc(100vh-64px)] bg-card/60 backdrop-blur-xl border-r border-border transition-all duration-300 overflow-hidden flex flex-col z-30 fixed top-16",
      isCollapsed ? "w-16" : "w-64"
    )} style={{
      left: 'var(--module-sidebar-width, 64px)',
      '--context-sidebar-width': isCollapsed ? '64px' : '256px'
    } as any}>
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      {/* Header */}
      <div className={cn(
        "h-16 px-6 flex items-center justify-between border-b border-border relative z-10",
        isCollapsed && "px-0 justify-center"
      )}>
        <span className={cn(
          "text-[10px] font-black text-muted-foreground opacity-40 transition-all duration-300",
          isCollapsed ? "opacity-0 invisible w-0" : "opacity-40 visible"
        )}>
          {activeModule.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} / Contexto
        </span>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded border border-border hover:bg-white/5 hover:text-primary transition-all duration-300"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 relative z-10 overflow-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon && iconMap[item.icon as keyof typeof iconMap];

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center transition-all duration-300 relative",
                isCollapsed
                  ? "justify-center w-12 h-12 mx-auto rounded-lg mb-2"
                  : "gap-3 p-3 rounded-md mb-1",
                isActive ? "bg-white/5 shadow-inner" : "hover:bg-white/[0.03]"
              )}
            >
              <div className={cn(
                "transition-all duration-300 flex items-center justify-center shrink-0",
                isCollapsed ? "w-10 h-10" : "p-2",
                isActive
                  ? "text-primary drop-shadow-[0_0_5px_rgba(255,85,0,0.3)]"
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {Icon}
              </div>

              {!isCollapsed && (
                <span className="text-sm font-bold transition-all duration-300 truncate">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
