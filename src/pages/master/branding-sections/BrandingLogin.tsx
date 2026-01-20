import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { UiAssetUploader } from "@/components/ui/branding-uploader";
import { cn } from "@/lib/utils";

interface BrandingLoginProps {
    loginLayout: 'center' | 'split';
    setLoginLayout: (layout: 'center' | 'split') => void;
    loginTitle: string;
    setLoginTitle: (val: string) => void;
    loginMessage: string;
    setLoginMessage: (val: string) => void;
    loginBgUrl: string;
    setLoginBgUrl: (val: string) => void;
    loginOverlayOpacity: number;
    setLoginOverlayOpacity: (val: number) => void;
    loginOverlayColor: string;
}

export function BrandingLogin({
    loginLayout, setLoginLayout,
    loginTitle, setLoginTitle,
    loginMessage, setLoginMessage,
    loginBgUrl, setLoginBgUrl,
    loginOverlayOpacity, setLoginOverlayOpacity,
    loginOverlayColor
}: BrandingLoginProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Portal de Login</h2>
                <p className="text-xs text-zinc-500">Personalize a primeira impressão do usuário.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 mb-2">Estrutura</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setLoginLayout('center')} className={cn("p-2 rounded-lg border text-center transition-all", loginLayout === 'center' ? "border-primary bg-primary/10" : "border-white/5 hover:bg-white/5")}>
                            <span className="text-[10px] font-bold text-zinc-400">Card Central</span>
                        </button>
                        <button onClick={() => setLoginLayout('split')} className={cn("p-2 rounded-lg border text-center transition-all", loginLayout === 'split' ? "border-primary bg-primary/10" : "border-white/5 hover:bg-white/5")}>
                            <span className="text-[10px] font-bold text-zinc-400">Split Screen</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 mb-4">Textos & Mensagens</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] text-zinc-600">Título</Label>
                            <Input value={loginTitle} onChange={(e) => setLoginTitle(e.target.value)} className="bg-black/40 border-white/10 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] text-zinc-600">Descritivo</Label>
                            <Input value={loginMessage} onChange={(e) => setLoginMessage(e.target.value)} className="bg-black/40 border-white/10 text-xs" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 mb-2">Wallpaper (Fundo)</h3>
                    <div className="space-y-4">
                        <UiAssetUploader label="Imagem de Fundo" value={loginBgUrl} onChange={setLoginBgUrl} />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] text-zinc-600">Escurecimento do Fundo (Overlay)</Label>
                                <span className="text-[10px] font-mono text-primary">{Math.round(loginOverlayOpacity * 100)}%</span>
                            </div>
                            <Slider min={0} max={1} step={0.05} value={[loginOverlayOpacity]} onValueChange={(v) => setLoginOverlayOpacity(v[0])} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
