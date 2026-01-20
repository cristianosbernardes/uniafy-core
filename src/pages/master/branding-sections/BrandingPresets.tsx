import { Palette, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BrandingPresetsProps {
    applyPreset: (preset: string) => void;
    selectedProfile: string;
    primaryColor: string;
}

export function BrandingPresets({ applyPreset, selectedProfile, primaryColor }: BrandingPresetsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Temas Prontos</h2>
                <p className="text-xs text-zinc-500">Escolha um ponto de partida para sua customização.</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'dark', label: 'Dark Industrial', bg: 'bg-zinc-950', border: 'border-white/10' },
                        { id: 'white', label: 'Clean White', bg: 'bg-white', border: 'border-zinc-200' },
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => applyPreset(p.id)}
                            className={cn(
                                "p-4 rounded-xl border flex items-center justify-between transition-all group overflow-hidden relative",
                                selectedProfile === p.id ? "border-primary ring-1 ring-primary/50 shadow-lg bg-primary/5" : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center", p.bg, p.border)}>
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${primaryColor})` }} />
                                </div>
                                <div className="text-left">
                                    <h4 className={cn("text-xs font-bold tracking-widest", (p.id === 'white') && selectedProfile !== p.id ? "text-white" : (p.id === 'white') ? "text-zinc-950" : "text-white")}>{p.label}</h4>
                                    <p className="text-[10px] text-zinc-500">Configuração master white-label pré-curada.</p>
                                </div>
                            </div>
                            {selectedProfile === p.id && <Check className="w-5 h-5 text-primary relative z-10" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
