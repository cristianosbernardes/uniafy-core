import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Spline } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

interface BrandingEmailProps {
    emailHeaderColor: string;
    setEmailHeaderColor: (val: string) => void;
    emailCtaColor: string;
    setEmailCtaColor: (val: string) => void;
    emailFooterText: string;
    setEmailFooterText: (val: string) => void;
}

export function BrandingEmail({
    emailHeaderColor,
    setEmailHeaderColor,
    emailCtaColor,
    setEmailCtaColor,
    emailFooterText,
    setEmailFooterText
}: BrandingEmailProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    E-mails Transacionais
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cor do Cabeçalho</Label>
                            <div className="flex gap-4 items-center">
                                <div className="h-10 w-10 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: emailHeaderColor }} />
                                <ColorPicker value={emailHeaderColor} onChange={setEmailHeaderColor} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Cor do Botão (CTA)</Label>
                            <div className="flex gap-4 items-center">
                                <div className="h-10 w-10 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: emailCtaColor }} />
                                <ColorPicker value={emailCtaColor} onChange={setEmailCtaColor} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Texto de Rodapé</Label>
                            <Input
                                value={emailFooterText}
                                onChange={(e) => setEmailFooterText(e.target.value)}
                                placeholder="Enviado por Uniafy..."
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                    </div>
                </div>

                {/* PREVIEW */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col items-center">
                    {/* Header Mock */}
                    <div className="w-full h-24 flex items-center justify-center relative" style={{ backgroundColor: emailHeaderColor }}>
                        <div className="w-8 h-8 bg-white/20 rounded backdrop-blur-sm" />
                    </div>

                    {/* Body Mock */}
                    <div className="w-full p-8 space-y-4 bg-white">
                        <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                        <div className="h-4 w-full bg-zinc-100 rounded" />
                        <div className="h-4 w-5/6 bg-zinc-100 rounded" />

                        <div className="pt-4 flex justify-center">
                            <button
                                className="px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg"
                                style={{ backgroundColor: emailCtaColor }}
                            >
                                Confirmar Ação
                            </button>
                        </div>
                    </div>

                    {/* Footer Mock */}
                    <div className="w-full bg-zinc-50 p-4 border-t border-zinc-100 text-center">
                        <p className="text-[10px] text-zinc-400">{emailFooterText || "© 2024 Uniafy Inc."}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
