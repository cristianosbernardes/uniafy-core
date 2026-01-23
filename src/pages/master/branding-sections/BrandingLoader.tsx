import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Activity, BarChart3, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandingLoaderProps {
    loaderType: 'spinner' | 'pulse' | 'bar' | 'custom';
    setLoaderType: (val: 'spinner' | 'pulse' | 'bar' | 'custom') => void;
    loaderCustomUrl?: string;
    setLoaderCustomUrl: (val: string) => void;
}

export function BrandingLoader({
    loaderType,
    setLoaderType,
    loaderCustomUrl,
    setLoaderCustomUrl
}: BrandingLoaderProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-primary" />
                    Tela de Carregamento
                </h2>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 space-y-6">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setLoaderType('spinner')}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-32 gap-3",
                            loaderType === 'spinner' ? "bg-primary/10 border-primary text-primary" : "bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-white/10"
                        )}
                    >
                        <Loader2 className={cn("w-8 h-8 animate-spin", loaderType === 'spinner' ? "text-primary" : "text-zinc-600")} />
                        <span className="text-xs font-medium">Spinner</span>
                    </button>

                    <button
                        onClick={() => setLoaderType('pulse')}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-32 gap-3",
                            loaderType === 'pulse' ? "bg-primary/10 border-primary text-primary" : "bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-white/10"
                        )}
                    >
                        <div className="relative flex h-8 w-8">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", loaderType === 'pulse' ? "bg-primary" : "bg-zinc-600")}></span>
                            <span className={cn("relative inline-flex rounded-full h-8 w-8", loaderType === 'pulse' ? "bg-primary" : "bg-zinc-700")}></span>
                        </div>
                        <span className="text-xs font-medium">Pulsante</span>
                    </button>

                    <button
                        onClick={() => setLoaderType('bar')}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-32 gap-3",
                            loaderType === 'bar' ? "bg-primary/10 border-primary text-primary" : "bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-white/10"
                        )}
                    >
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className={cn("h-full w-2/3 rounded-full animate-[shimmer_2s_infinite]", loaderType === 'bar' ? "bg-primary" : "bg-zinc-500")} style={{ transform: 'translateX(-50%)' }} />
                        </div>
                        <span className="text-xs font-medium">Barra de Progresso</span>
                    </button>

                    <button
                        onClick={() => setLoaderType('custom')}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-32 gap-3",
                            loaderType === 'custom' ? "bg-primary/10 border-primary text-primary" : "bg-zinc-950/50 border-white/5 text-zinc-500 hover:border-white/10"
                        )}
                    >
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs font-medium">Custom (GIF/SVG)</span>
                    </button>
                </div>

                {loaderType === 'custom' && (
                    <div className="space-y-4 pt-6 border-t border-white/5 animate-in fade-in">
                        <div className="space-y-1">
                            <Label>URL do Loader (GIF, SVG ou Lottie JSON)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={loaderCustomUrl || ''}
                                    onChange={(e) => setLoaderCustomUrl(e.target.value)}
                                    placeholder="https://exemplo.com/loader.gif"
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <p className="text-xs text-zinc-500">Recomendado: GIFs com fundo transparente ou SVGs animados.</p>
                        </div>

                        {loaderCustomUrl && (
                            <div className="flex justify-center p-8 bg-black/40 rounded-lg border border-white/5 dashed-border">
                                <img src={loaderCustomUrl} className="h-16 w-16 object-contain" alt="Loader Preview" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
