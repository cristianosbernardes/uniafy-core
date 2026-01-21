import { ColorPicker } from "@/components/ui/color-picker";

interface BrandingColorsProps {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
}

export function BrandingColors({ primaryColor, setPrimaryColor }: BrandingColorsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Cores Dinâmicas</h2>
                <p className="text-xs text-muted-foreground">Defina a cor principal da sua marca.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-primary mb-2">Identidade Visual</h3>
                    <ColorPicker label="Cor Primária (Sua Marca)" value={primaryColor} onChange={setPrimaryColor} />
                    <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                        Esta cor será aplicada automaticamente em botões, ícones de destaque e elementos de interação em ambos os temas (Dark e White).
                    </p>
                </div>
            </div>
        </div>
    );
}
