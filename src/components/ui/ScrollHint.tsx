import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollHintProps {
    children: ReactNode;
    className?: string;
    height?: string;
}

export function ScrollHint({ children, className, height = "h-[400px]" }: ScrollHintProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showHint, setShowHint] = useState(false);

    const checkScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        // Mostra hint se o scroll não estiver no final (com uma tolerância de 20px)
        const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 20;
        const hasScroll = el.scrollHeight > el.clientHeight;

        setShowHint(hasScroll && !isAtBottom);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [children]);

    return (
        <div className="relative group">
            <div
                ref={containerRef}
                onScroll={checkScroll}
                className={cn("overflow-y-auto scrollbar-hide relative", height, className)}
            >
                {children}
            </div>

            {/* Scroll Hint Overlay */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none flex items-end justify-center pb-4 transition-opacity duration-300",
                    showHint ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm border border-white/10 animate-float-arrow shadow-lg shadow-black/50">
                    <ChevronDown className="w-5 h-5 text-primary" />
                </div>
            </div>
        </div>
    );
}
