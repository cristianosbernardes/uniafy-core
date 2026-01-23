import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, CheckCircle, AlertOctagon, Bell } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface BrandingSoundsProps {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
    volume: number;
    setVolume: (v: number) => void;
}

export function BrandingSounds({ enabled, setEnabled, volume, setVolume }: BrandingSoundsProps) {

    const playTestSound = (type: 'success' | 'error' | 'notify') => {
        if (!enabled) {
            toast.error("Ative os sons para testar.");
            return;
        }

        // Mock sound playback - in a real app this would use an Audio object
        // For demonstration, we just show a toast, but "simulating" the feedback
        if (type === 'success') toast.success("Som de Sucesso Tocado! 🎵");
        if (type === 'error') toast.error("Som de Erro Tocado! 🎵");
        if (type === 'notify') toast.info("Notificação Tocada! 🎵");
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Feedback Sonoro</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                        <div className="space-y-1">
                            <Label className="text-base text-zinc-200">Sons do Sistema</Label>
                            <p className="text-xs text-zinc-500">
                                Feedback sonoro para ações como salvar, erros e notificações.
                            </p>
                        </div>
                        <Switch
                            checked={enabled}
                            onCheckedChange={setEnabled}
                        />
                    </div>

                    <div className={!enabled ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                        <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-zinc-400">Volume Master</Label>
                                <span className="text-xs font-mono text-primary">{Math.round(volume * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-zinc-500" />}
                                <Slider
                                    value={[volume]}
                                    max={1}
                                    step={0.05}
                                    onValueChange={([val]) => setVolume(val)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <Separator className="my-6 bg-white/5" />

                        <h4 className="text-xs font-medium text-zinc-500 mb-3">TESTAR SONS</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => playTestSound('success')}
                                className="flex flex-col h-20 gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20 transition-all"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-xs">Sucesso</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => playTestSound('error')}
                                className="flex flex-col h-20 gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                            >
                                <AlertOctagon className="w-5 h-5" />
                                <span className="text-xs">Erro</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => playTestSound('notify')}
                                className="flex flex-col h-20 gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20 transition-all"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="text-xs">Notify</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
