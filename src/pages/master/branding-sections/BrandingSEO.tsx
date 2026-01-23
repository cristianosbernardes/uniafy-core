import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UiAssetUploader } from "@/components/ui/branding-uploader";
import { Globe, Search, Smartphone } from "lucide-react";

interface BrandingSEOProps {
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    ogImage: string;
    setOgImage: (v: string) => void;
}

export function BrandingSEO({ title, setTitle, description, setDescription, ogImage, setOgImage }: BrandingSEOProps) {
    return (
        <div className="space-y-8">
            {/* Meta Tags Configuration */}
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Identidade de Pesquisa (SEO)</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-500">Título do Site (Template)</Label>
                        <div className="relative">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="%s | Uniafy"
                                className="bg-zinc-900/50 border-white/5 pl-9"
                            />
                            <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-3" />
                        </div>
                        <p className="text-[10px] text-zinc-600">
                            Use <b>%s</b> para indicar onde o nome da página atual entrará (ex: "Dashboard | Sua Marca").
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-500">Descrição Global</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A plataforma definitiva para..."
                            className="bg-zinc-900/50 border-white/5 resize-none min-h-[80px]"
                        />
                    </div>
                </div>
            </div>

            {/* Social Preview (Open Graph) */}
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Preview Social (Open Graph)</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-500">Imagem de Capa (1200x630)</Label>
                        <UiAssetUploader
                            currentUrl={ogImage}
                            onUpload={(url) => setOgImage(url)}
                            label="Capa de Compartilhamento"
                            bucket="branding-assets"
                        />
                    </div>

                    {/* Preview Simulation */}
                    <div className="mt-4 bg-zinc-900 rounded-lg border border-white/5 overflow-hidden max-w-sm mx-auto">
                        <div className="bg-[#2c2c2c] p-3 flex items-center gap-2 border-b border-black/20">
                            <Smartphone className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs text-zinc-400">WhatsApp / iMessage Preview</span>
                        </div>
                        <div className="p-3 bg-[#e5ddd5]/5 md:bg-[#e5ddd5]/10"> {/* Fake WhatsApp Background Tone */}
                            <div className="bg-[#1f2c34] rounded-lg overflow-hidden max-w-[300px] shadow-lg">
                                {ogImage ? (
                                    <img src={ogImage} className="w-full h-40 object-cover" alt="OG Preview" />
                                ) : (
                                    <div className="w-full h-40 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                                        Sem Imagem
                                    </div>
                                )}
                                <div className="p-3">
                                    <h4 className="text-zinc-100 font-medium text-sm leading-tight mb-1">
                                        {title.replace('%s', 'Dashboard')}
                                    </h4>
                                    <p className="text-zinc-400 text-xs line-clamp-2">
                                        {description || "Descrição padrão do sistema aparecerá aqui..."}
                                    </p>
                                    <p className="text-zinc-600 text-[10px] mt-2">app.uniafy.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
