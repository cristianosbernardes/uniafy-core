import { LucideIcon, BarChart3, ShieldAlert, FileText, Brain, Zap, Calendar, LineChart, Bell, LayoutDashboard, Crown, Building2, Settings, Key, Database, Globe, CreditCard, Palette, Target, Search, Users, Briefcase, CheckCircle2, HeartPulse, Share2 } from "lucide-react";

interface EmptyPlaceholderProps {
    title: string;
    description: string;
    icon: string;
}

// Map of icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
    BarChart3, ShieldAlert, FileText, Brain, Zap, Calendar, LineChart, Bell,
    LayoutDashboard, Crown, Building2, Settings, Key, Database, Globe, CreditCard,
    Palette, Target, Search, Users, Briefcase, CheckCircle2, HeartPulse, Share2
};

export function EmptyPlaceholder({ title, description, icon }: EmptyPlaceholderProps) {
    const Icon = iconMap[icon] || BarChart3;

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_-10px] shadow-primary/30">
                <Icon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-muted-foreground max-w-md text-lg">{description}</p>
        </div>
    );
}
