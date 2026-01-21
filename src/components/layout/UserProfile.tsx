import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserProfileProps {
    showLabel?: boolean;
}

export function UserProfile({ showLabel = true }: UserProfileProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors group outline-none",
                        !showLabel && "justify-center p-0 w-10 h-10"
                    )}
                >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 shrink-0">
                        <span className="text-primary font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>

                    {showLabel && (
                        <>
                            <div className="flex flex-col items-start text-left overflow-hidden">
                                <span className="text-sm font-medium text-zinc-200 truncate w-24">
                                    {user.name || 'Usuário'}
                                </span>
                                <span className="text-[10px] text-zinc-500 capitalize">
                                    {user.role}
                                </span>
                            </div>
                            <ChevronUp className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 ml-auto" />
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56 bg-zinc-950 border-white/10 text-zinc-400">
                <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
                    Minha Conta ({user.email})
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                    className="focus:bg-white/10 focus:text-zinc-200 cursor-pointer"
                    onClick={() => navigate('/sistema/perfil')}
                >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
