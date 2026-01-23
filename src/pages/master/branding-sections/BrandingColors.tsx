import { ColorPicker } from "@/components/ui/color-picker";

interface BrandingColorsProps {
    // Top level
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    bgColor: string;
    setBgColor: (color: string) => void;

    // Sidebar
    sidebarMenuColor: string;
    setSidebarMenuColor: (color: string) => void;
    sidebarSubmenuColor: string;
    setSidebarSubmenuColor: (color: string) => void;

    // UI Elements
    borderColor: string;
    setBorderColor: (color: string) => void;
    cardColor: string;
    setCardColor: (color: string) => void;
    hoverColor: string;
    setHoverColor: (color: string) => void;

    // Typography
    textPrimaryColor: string;
    setTextPrimaryColor: (color: string) => void;
    textSecondaryColor: string;
    setTextSecondaryColor: (color: string) => void;

    // Header
    headerBgColor: string;
    setHeaderBgColor: (color: string) => void;
    headerIconsColor: string;
    setHeaderIconsColor: (color: string) => void;
}

export function BrandingColors({
    primaryColor, setPrimaryColor,
    bgColor, setBgColor,
    sidebarMenuColor, setSidebarMenuColor,
    sidebarSubmenuColor, setSidebarSubmenuColor,
    borderColor, setBorderColor,
    cardColor, setCardColor,
    hoverColor, setHoverColor,
    textPrimaryColor, setTextPrimaryColor,
    textSecondaryColor, setTextSecondaryColor,
    headerBgColor, setHeaderBgColor,
    headerIconsColor, setHeaderIconsColor
}: BrandingColorsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300 pb-12">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Cores do Sistema</h2>
                <p className="text-xs text-muted-foreground">Personalize cada detalhe da interface.</p>
            </div>

            <div className="space-y-6">
                {/* Branding Core */}
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Marca & Base</h3>
                    <ColorPicker label="Cor Primária (Sua Marca)" value={primaryColor} onChange={setPrimaryColor} />
                    <ColorPicker label="Fundo da Aplicação" value={bgColor} onChange={setBgColor} />
                </div>

                {/* Sidebar & Layout */}
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Layout & Sidebar</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <ColorPicker label="Fundo Menu (Esquerda)" value={sidebarMenuColor} onChange={setSidebarMenuColor} />
                        <ColorPicker label="Fundo Submenu (Retrátil)" value={sidebarSubmenuColor} onChange={setSidebarSubmenuColor} />
                    </div>
                </div>

                {/* Header & Topbar */}
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Cabeçalho (Header)</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <ColorPicker label="Fundo do Cabeçalho" value={headerBgColor} onChange={setHeaderBgColor} />
                        <ColorPicker label="Cor dos Ícones" value={headerIconsColor} onChange={setHeaderIconsColor} />
                    </div>
                </div>

                {/* UI Details */}
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Elementos de UI</h3>
                    <ColorPicker label="Cor das Bordas / Linhas" value={borderColor} onChange={setBorderColor} />
                    <ColorPicker label="Fundo dos Cards" value={cardColor} onChange={setCardColor} />
                    <ColorPicker label="Efeito Hover (Passar o Mouse)" value={hoverColor} onChange={setHoverColor} />
                </div>

                {/* Typography */}
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Tipografia</h3>
                    <ColorPicker label="Texto Principal" value={textPrimaryColor} onChange={setTextPrimaryColor} />
                    <ColorPicker label="Texto Secundário / Mudo" value={textSecondaryColor} onChange={setTextSecondaryColor} />
                </div>
            </div>
        </div>
    );
}
