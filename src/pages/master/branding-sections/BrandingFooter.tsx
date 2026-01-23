import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copyright, Link as LinkIcon, ExternalLink } from "lucide-react";

interface BrandingFooterProps {
    text: string;
    setText: (v: string) => void;
    showLinks: boolean;
    setShowLinks: (v: boolean) => void;
}

export function BrandingFooter({ text, setText, showLinks, setShowLinks }: BrandingFooterProps) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Rodapé Global</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-500">Texto de Copyright</Label>
                        <div className="relative">
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="© 2026 Uniafy Platform"
                                className="bg-zinc-900/50 border-white/5 pl-9"
                            />
                            <Copyright className="w-4 h-4 text-zinc-600 absolute left-3 top-3" />
                        </div>
                        <p className="text-[10px] text-zinc-600">
                            Suporta HTML básico como &lt;a&gt;, &lt;b&gt; e emojis.
                        </p>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                        <div className="space-y-1">
                            <Label className="text-base text-zinc-200">Links de Termos e Privacidade</Label>
                            <p className="text-xs text-zinc-500">
                                Exibir links padrão de documentos legais no rodapé.
                            </p>
                        </div>
                        <Switch
                            checked={showLinks}
                            onCheckedChange={setShowLinks}
                        />
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Visualização (Preview)</h3>
                <div className="border-t border-white/10 pt-6 mt-6">
                    <footer className="w-full py-4 text-center space-y-2">
                        <p className="text-xs text-zinc-500" dangerouslySetInnerHTML={{ __html: text || "© Texto Padrão" }} />
                        {showLinks && (
                            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600">
                                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Termos de Uso</span>
                                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacidade</span>
                                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Suporte</span>
                            </div>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}
