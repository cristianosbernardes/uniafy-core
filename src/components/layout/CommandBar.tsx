import {
    Search,
    Bell,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CommandBarProps {
    isContextOpen?: boolean;
    onToggleContext?: () => void;
}

export function CommandBar({ isContextOpen, onToggleContext }: CommandBarProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative group">
                <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse ring-2 ring-[var(--bg-layout-menu)]" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <HelpCircle className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 mx-2" />

            {/* User Profile */}
            {user && (
                <div className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-100 transition-opacity group">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-semibold text-white/90 leading-none">{user.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">Admin</span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-9 h-9 rounded-full bg-[var(--bg-layout-workspace)] border border-white/10 flex items-center justify-center shadow-sm text-zinc-400 font-bold text-sm hover:border-primary/50 hover:text-primary transition-all group-hover:ring-2 ring-primary/20"
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </button>
                </div>
            )}
        </div>
    );
}

