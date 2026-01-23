import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";

interface BrandingTypographyProps {
    fontFamily: string;
    setFontFamily: (val: string) => void;
    fontHeadings?: string;
    setFontHeadings?: (val: string) => void;
}

const GOOGLE_FONTS = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Nunito",
    "Playfair Display",
    "Merriweather",
    "Oswald",
    "Source Sans Pro",
    "Slabo 27px",
    "PT Sans",
    "Roboto Condensed"
];

export function BrandingTypography({
    fontFamily,
    setFontFamily,
    fontHeadings,
    setFontHeadings
}: BrandingTypographyProps) {

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Tipografia Global
                </h2>
            </div>

            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-white/5">

                {/* Body Font */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-base text-zinc-200">Fonte Principal (Corpo/UI)</Label>
                        <p className="text-xs text-zinc-500">Usada em textos, menus e elementos de interface.</p>
                    </div>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white h-12">
                            <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                            {GOOGLE_FONTS.map(font => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                    {font}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Headings Font (Future Proofing for new BrandingConfig) */}
                {setFontHeadings && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <Label className="text-base text-zinc-200">Fonte de Títulos (Opcional)</Label>
                            <p className="text-xs text-zinc-500">Destaque para cabeçalhos e manchetes.</p>
                        </div>
                        <Select value={fontHeadings || fontFamily} onValueChange={setFontHeadings}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white h-12">
                                <SelectValue placeholder="Mesma da principal" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800">
                                <SelectItem value="default">Mesma da principal</SelectItem>
                                {GOOGLE_FONTS.map(font => (
                                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Live Preview Tip */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                    <p className="text-xs text-blue-400">
                        O preview ao lado irá carregar a fonte selecionada automaticamente via Google Fonts API.
                    </p>
                </div>
            </div>
        </div>
    );
}
