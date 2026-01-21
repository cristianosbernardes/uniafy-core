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


        </div>
    );
}

