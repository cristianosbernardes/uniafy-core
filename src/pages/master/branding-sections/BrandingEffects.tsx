import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandingEffectsProps {
    shadowStyle: 'flat' | 'soft' | 'hard';
    setShadowStyle: (val: 'flat' | 'soft' | 'hard') => void;
    // Future: border styles, animations
}

export function BrandingEffects({ shadowStyle, setShadowStyle }: BrandingEffectsProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Profundidade & Efeitos
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">

                {/* FLAT */}
                <button
                    onClick={() => setShadowStyle('flat')}
                    className={cn(
                        "group relative flex items-center p-4 rounded-xl border transition-all text-left",
                        shadowStyle === 'flat'
                            ? "bg-zinc-900 border-primary"
                            : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                    )}
                >
                    <div className="h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mr-4">
                        <div className="w-6 h-6 bg-zinc-600 rounded-sm"></div>
                    </div>
                    <div>
                        <h3 className={cn("font-medium", shadowStyle === 'flat' ? "text-primary" : "text-zinc-200")}>Flat / Minimal</h3>
                        <p className="text-xs text-zinc-500">Design plano sem sombras, focado em bordas e cores sólidas.</p>
                    </div>
                </button>

                {/* SOFT (Default) */}
                <button
                    onClick={() => setShadowStyle('soft')}
                    className={cn(
                        "group relative flex items-center p-4 rounded-xl border transition-all text-left",
                        shadowStyle === 'soft'
                            ? "bg-zinc-900 border-primary"
                            : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                    )}
                >
                    <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mr-4 shadow-lg border border-zinc-700/50">
                        <div className="w-6 h-6 bg-zinc-600 rounded-sm shadow-sm"></div>
                    </div>
                    <div>
                        <h3 className={cn("font-medium", shadowStyle === 'soft' ? "text-primary" : "text-zinc-200")}>Soft / Modern</h3>
                        <p className="text-xs text-zinc-500">Sombras suaves e difusas. Estilo padrão de interfaces SaaS modernas.</p>
                    </div>
                </button>

                {/* HARD */}
                <button
                    onClick={() => setShadowStyle('hard')}
                    className={cn(
                        "group relative flex items-center p-4 rounded-xl border transition-all text-left",
                        shadowStyle === 'hard'
                            ? "bg-zinc-900 border-primary"
                            : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                    )}
                >
                    <div className="h-12 w-12 rounded-lg bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center shrink-0 mr-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-6 h-6 bg-zinc-600 rounded-sm border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                    </div>
                    <div>
                        <h3 className={cn("font-medium", shadowStyle === 'hard' ? "text-primary" : "text-zinc-200")}>Hard / Brutalist</h3>
                        <p className="text-xs text-zinc-500">Sombras sólidas e contrastantes. Estilo retro ou neo-brutalista.</p>
                    </div>
                </button>

            </div>
        </div>
    );
}
