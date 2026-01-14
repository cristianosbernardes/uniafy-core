import { cn } from '@/lib/utils';
import { PanelLeftOpen, ChevronsRight } from 'lucide-react';

interface SidebarHeaderProps {
    isOpen: boolean;
    activeModule: string;
}

export function SidebarHeader({ isOpen, activeModule }: SidebarHeaderProps) {
    return (
        <div
            className={cn(
                "fixed top-0 left-0 h-[var(--h-header)] z-[60] flex items-center transition-all duration-300 ease-in-out pointer-events-none", // Pointer events none to let clicks pass if needed, but we have text.
                // We make it transparent so the rails 'continuously' go up visually, or we match colors.
                // Actually, let's keep it transparent and just position the Logo over the rail.
                "w-[calc(64px+240px)]"
            )}
        >
            {/* Brand Icon (Centered in 64px Rail) */}
            <div className="w-[var(--w-sidebar-collapsed)] h-full flex items-center justify-center shrink-0 pointer-events-auto">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary">
                    <span className="font-extrabold text-xl">U</span>
                </div>
            </div>

            {/* Brand Text (In Submenu Area) */}
            <div className={cn(
                "flex-1 flex px-4 items-center overflow-hidden whitespace-nowrap pointer-events-auto transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0"
            )}>
                <span className="text-white/40 font-bold text-sm tracking-widest uppercase">Uniafy Central</span>
            </div>
        </div>
    );
}
