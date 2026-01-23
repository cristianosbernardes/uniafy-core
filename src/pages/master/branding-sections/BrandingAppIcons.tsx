import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Smartphone, MonitorSmartphone } from "lucide-react";

interface BrandingAppIconsProps {
    appleTouchIcon?: string;
    setAppleTouchIcon: (val: string) => void;
    androidIcon192?: string;
    setAndroidIcon192: (val: string) => void;
    androidIcon512?: string;
    setAndroidIcon512: (val: string) => void;
}

export function BrandingAppIcons({
    appleTouchIcon,
    setAppleTouchIcon,
    androidIcon192,
    setAndroidIcon192,
    androidIcon512,
    setAndroidIcon512
}: BrandingAppIconsProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Ícones de Aplicativo (PWA)
                </h2>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 space-y-6">
                {/* Apple Touch Icon */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                            <i className="fab fa-apple text-lg"></i>
                            Apple Touch Icon (iOS)
                        </Label>
                        <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">180x180px</span>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="h-16 w-16 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                            {appleTouchIcon ? (
                                <img src={appleTouchIcon} className="w-full h-full object-cover" />
                            ) : (
                                <Smartphone className="w-6 h-6 text-zinc-700" />
                            )}
                        </div>
                        <Input
                            value={appleTouchIcon || ''}
                            onChange={(e) => setAppleTouchIcon(e.target.value)}
                            placeholder="https://.../apple-icon.png"
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <p className="text-xs text-zinc-500 pl-20">Este ícone aparecerá na tela inicial de iPhones e iPads quando o site for salvo.</p>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* Android Icons */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                            <MonitorSmartphone className="w-4 h-4" />
                            Android Chrome Icons
                        </Label>
                        <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">192px & 512px</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>Icon 192x192</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-12 w-12 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                                    {androidIcon192 ? <img src={androidIcon192} className="w-full h-full object-cover" /> : <Smartphone className="w-4 h-4 text-zinc-700" />}
                                </div>
                                <Input
                                    value={androidIcon192 || ''}
                                    onChange={(e) => setAndroidIcon192(e.target.value)}
                                    placeholder="URL do ícone 192px"
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>Icon 512x512 (Splash)</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-12 w-12 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                                    {androidIcon512 ? <img src={androidIcon512} className="w-full h-full object-cover" /> : <Smartphone className="w-4 h-4 text-zinc-700" />}
                                </div>
                                <Input
                                    value={androidIcon512 || ''}
                                    onChange={(e) => setAndroidIcon512(e.target.value)}
                                    placeholder="URL do ícone 512px"
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
