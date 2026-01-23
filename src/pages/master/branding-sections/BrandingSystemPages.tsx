import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Ghost, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface BrandingSystemPagesProps {
    maintenanceIsActive: boolean;
    setMaintenanceIsActive: (val: boolean) => void;
    maintenanceMessage: string;
    setMaintenanceMessage: (val: string) => void;
    maintenanceReturn: string;
    setMaintenanceReturn: (val: string) => void;
    notFoundImageUrl: string;
    setNotFoundImageUrl: (val: string) => void;
    notFoundTitle: string;
    setNotFoundTitle: (val: string) => void;
}

export function BrandingSystemPages({
    maintenanceIsActive,
    setMaintenanceIsActive,
    maintenanceMessage,
    setMaintenanceMessage,
    maintenanceReturn,
    setMaintenanceReturn,
    notFoundImageUrl,
    setNotFoundImageUrl,
    notFoundTitle,
    setNotFoundTitle
}: BrandingSystemPagesProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Ghost className="w-5 h-5 text-primary" />
                    Páginas de Sistema
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* MAINTENANCE MODE */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white">Modo de Manutenção</h3>
                                <p className="text-xs text-zinc-500">Bloqueia o acesso ao sistema para todos os usuários (exceto Master).</p>
                            </div>
                        </div>
                        <Switch checked={maintenanceIsActive} onCheckedChange={setMaintenanceIsActive} />
                    </div>

                    {maintenanceIsActive && (
                        <div className="space-y-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label>Mensagem de Aviso</Label>
                                <Textarea
                                    value={maintenanceMessage}
                                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                                    placeholder="Estamos realizando melhorias..."
                                    className="bg-zinc-950 border-zinc-800 min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Previsão de Retorno</Label>
                                <Input
                                    value={maintenanceReturn}
                                    onChange={(e) => setMaintenanceReturn(e.target.value)}
                                    placeholder="Ex: Voltamos às 18:00"
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 404 PAGE */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Ghost className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white">Página 404 (Not Found)</h3>
                            <p className="text-xs text-zinc-500">Personalize a tela quando um link não é encontrado.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título Personalizado</Label>
                            <Input
                                value={notFoundTitle}
                                onChange={(e) => setNotFoundTitle(e.target.value)}
                                placeholder="Algo de errado não está certo..."
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL da Imagem/GIF</Label>
                            <div className="flex gap-4">
                                <Input
                                    value={notFoundImageUrl}
                                    onChange={(e) => setNotFoundImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-zinc-950 border-zinc-800"
                                />
                                {notFoundImageUrl && <img src={notFoundImageUrl} className="h-10 w-10 rounded object-cover border border-white/10" />}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
