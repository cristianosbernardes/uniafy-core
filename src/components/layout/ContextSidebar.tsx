import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
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
  FileText,
  HeartPulse,
  Rocket,
  Wallet,
  PenTool,
  Microscope,
  Globe,
  CheckCircle2,
  Share2,
  Building,
  Crown,
  Laptop,
  ChevronsLeft,
  ShieldAlert,
  TrendingUp,
  Settings,
  Briefcase,
  Siren
} from 'lucide-react';
import { NAV_MODULES } from '@/config/navigation';
import { NavItem, UserRole } from '@/types/uniafy';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface ContextSidebarProps {
  activeModule: string;
  userRole: UserRole;
  isOpen?: boolean;
  onToggle?: () => void;
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
  FileText: <FileText className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Rocket: <Rocket className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  PenTool: <PenTool className="w-4 h-4" />,
  Microscope: <Microscope className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Crown: <Crown className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Siren: <Siren className="w-4 h-4" />,
};


export function ContextSidebar({ activeModule, userRole, isOpen = true, onToggle }: ContextSidebarProps) {
  const location = useLocation();

  const currentModule = NAV_MODULES.find(m => m.id === activeModule);
  // Use 'title', 'label' or appropriate field. The interface usually has 'icon', 'path', 'label' or 'title'. 
  // Let's assume 'title' based on previous edits, but check NAV_MODULES types if possible. 
  // Previous file content showed 'item.title'.
  const items = currentModule?.items.filter(item => item.roles.includes(userRole)) || [];

  return (
    <div className="flex flex-col h-full w-full">

      {/* 
        CONTEXT HEADER (ClickUp Style)
        - Title: 16px font-bold (Matches user request)
        - Collapse Action: Icon to retract submenu
      */}
      <div className="flex items-center justify-between p-4 pb-2 shrink-0 group/header">
        <h2 className="text-[16px] font-bold text-white leading-tight truncate">
          {currentModule?.label || (activeModule === 'growth' ? 'Growth Engine' : 'Módulo')}
        </h2>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover/header:opacity-100"
          title="Recolher Submenu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Selector / Breadcrumb (Optional - keeping simplified or removing based on new header) */}
      {/* Keeping it simple as requested: Just the menu items list below using the custom scrollbar */}

      {/* Menu Items Area */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar pr-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon && iconMap[item.icon as keyof typeof iconMap];

          return (
            <Link
              key={item.path}
              to={item.path}
              className="group relative flex items-center w-full px-3 py-1.5 mb-0.5"
            >
              {/* Active State: Rounded Background */}
              <div
                className={cn(
                  "absolute inset-0 mx-2 rounded-md transition-all duration-200",
                  isActive ? "bg-[#292929]" : "bg-transparent group-hover:bg-[#191919]"
                )}
              />

              <div className="relative flex items-center z-10 w-full px-2">
                <div className={cn("transition-colors shrink-0 mr-3", isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")}>
                  {Icon}
                </div>
                <span className={cn(
                  "text-[14px] font-medium transition-colors truncate leading-none pt-0.5", // 14px Font
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                )}>
                  {item.title}
                </span>

                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      isActive ? "bg-primary/20 text-primary" : "bg-white/10 text-zinc-400"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
