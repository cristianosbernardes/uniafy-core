import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo Container */}
                <div className="relative">
                    <div className="text-4xl md:text-6xl font-black tracking-[0.2em] text-white">
                        UNIAFY
                    </div>
                    <div className="absolute -inset-1 blur-lg bg-orange-500/20 opacity-50 animate-pulse" />
                </div>

                {/* Loading Bar Container */}
                <div className="w-[200px] h-1 bg-white/10 rounded-full overflow-hidden relative">
                    {/* Animated Loading Bar */}
                    <div
                        className="h-full bg-orange-500 shadow-[0_0_10px_2px_rgba(249,115,22,0.5)] transition-all duration-200 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {/* Status Text */}
                <div className="flex flex-col items-center gap-2">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/40 font-medium">
                        Carregando Sistema
                    </div>
                    <div className="text-[10px] font-mono text-orange-500/60">
                        {Math.min(Math.floor(progress), 100)}%
                    </div>
                </div>
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};
