
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe, Palette, Upload, CheckCircle2, RotateCw, Monitor, Smartphone, LayoutDashboard, Zap, Users, Sliders, LayoutTemplate, MousePointerClick, Save, Trash2, LayoutGrid, Activity, Settings2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";
import { agencyService, AgencySettings } from "@/services/agencyService";
import { ColorPicker } from "@/components/ui/color-picker";
import { UiAssetUploader } from "@/components/ui/branding-uploader";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AgencyWhiteLabel() {
    const { user } = useAuth();
    const { refreshBranding } = useBranding();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // States following SystemBranding.tsx pattern
    const [primaryColor, setPrimaryColor] = useState("24 100% 52%");
    const [bgColor, setBgColor] = useState("240 10% 2%");
    const [sidebarMenuColor, setSidebarMenuColor] = useState("0 0% 2%");
    const [sidebarSubmenuColor, setSidebarSubmenuColor] = useState("0 0% 5%");

    // Advanced UI Colors
    const [borderColor, setBorderColor] = useState("0 0% 100% / 0.1");
    const [cardColor, setCardColor] = useState("0 0% 100% / 0.05");
    const [hoverColor, setHoverColor] = useState("24 100% 52% / 0.1");
    const [headerBgColor, setHeaderBgColor] = useState("240 10% 2%");
    const [headerIconsColor, setHeaderIconsColor] = useState("0 0% 100%");
    const [iconsGlobalColor, setIconsGlobalColor] = useState("24 100% 52%");

    // Assets
    const [logoUrl, setLogoUrl] = useState("");
    const [customDomain, setCustomDomain] = useState("");

    // UI/Typography State
    const [radius, setRadius] = useState(8);
    const [fontFamily, setFontFamily] = useState("Inter");
    const [fsBase, setFsBase] = useState(14);
    const [fsTitle, setFsTitle] = useState(24);
    const [fsCardTitle, setFsCardTitle] = useState(18);
    const [fsMenu, setFsMenu] = useState(13);
    const [fsSubmenu, setFsSubmenu] = useState(14);
    const [fsSmall, setFsSmall] = useState(12);
    const [fsStats, setFsStats] = useState(32);
    const [fsSubtitle, setFsSubtitle] = useState(14);
    const [glassBlur, setGlassBlur] = useState(12);
    const [glassOpacity, setGlassOpacity] = useState(0.05);

    // Status Colors
    const [successColor, setSuccessColor] = useState("142 71% 45%");
    const [warningColor, setWarningColor] = useState("48 96% 53%");
    const [errorColor, setErrorColor] = useState("0 84% 60%");
    const [infoColor, setInfoColor] = useState("217 91% 60%");
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        if (user) loadSettings();
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await agencyService.getSettings(user.id);
            if (data) {
                setCustomDomain(data.custom_domain || "");
                setLogoUrl(data.branding_logo || "");

                const colors = data.branding_colors;
                if (colors) {
                    setPrimaryColor(colors.primary || "24 100% 52%");
                    setBgColor(colors.background || "240 10% 2%");
                    setSidebarMenuColor(colors.sidebar_menu || colors.sidebar || "0 0% 2%");
                    setSidebarSubmenuColor(colors.sidebar_submenu || colors.sidebar || "0 0% 5%");

                    if (colors.border) setBorderColor(colors.border);
                    if (colors.card) setCardColor(colors.card);
                    if (colors.hover) setHoverColor(colors.hover);
                    if (colors.header_bg) setHeaderBgColor(colors.header_bg);
                    if (colors.header_icons) setHeaderIconsColor(colors.header_icons);
                    if (colors.icons_global) setIconsGlobalColor(colors.icons_global);
                    if (colors.success) setSuccessColor(colors.success);
                    if (colors.warning) setWarningColor(colors.warning);
                    if (colors.error) setErrorColor(colors.error);
                    if (colors.info) setInfoColor(colors.info);
                }

                const ui = data.branding_ui;
                if (ui) {
                    if (ui.radius !== undefined) setRadius(ui.radius * 16);
                    if (ui.fontFamily) setFontFamily(ui.fontFamily);
                    if (ui.fontSizes) {
                        setFsBase(ui.fontSizes.base || 14);
                        setFsTitle(ui.fontSizes.titles || 24);
                        setFsCardTitle(ui.fontSizes.cardTitles || 18);
                        setFsMenu(ui.fontSizes.menu || 13);
                        setFsSubmenu(ui.fontSizes.submenu || 14);
                        setFsSmall(ui.fontSizes.small || 12);
                        setFsStats(ui.fontSizes.stats || 32);
                        setFsSubtitle(ui.fontSizes.subtitles || 14);
                    }
                    if (ui.glass) {
                        setGlassBlur(ui.glass.blur ?? 12);
                        setGlassOpacity(ui.glass.opacity ?? 0.05);
                    }
                }
            }
        } catch (error) {
            toast.error("Erro ao carregar configurações.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const settings: AgencySettings = {
                custom_domain: customDomain,
                branding_logo: logoUrl,
                branding_colors: {
                    primary: primaryColor,
                    background: bgColor,
                    sidebar_menu: sidebarMenuColor,
                    sidebar_submenu: sidebarSubmenuColor,
                    sidebar_active: primaryColor,
                    border: borderColor,
                    card: cardColor,
                    hover: hoverColor,
                    header_bg: headerBgColor,
                    header_icons: headerIconsColor,
                    icons_global: iconsGlobalColor,
                    success: successColor,
                    warning: warningColor,
                    error: errorColor,
                    info: infoColor
                },
                branding_ui: {
                    radius: radius / 16,
                    fontFamily: fontFamily,
                    glass: {
                        blur: glassBlur,
                        opacity: glassOpacity
                    },
                    fontSizes: {
                        base: fsBase,
                        titles: fsTitle,
                        cardTitles: fsCardTitle,
                        menu: fsMenu,
                        submenu: fsSubmenu,
                        small: fsSmall,
                        stats: fsStats,
                        subtitles: fsSubtitle
                    }
                }
            };
            await agencyService.updateSettings(user.id, settings);
            await refreshBranding();
            toast.success("Identidade visual aplicada com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar configurações.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (preset: 'dark' | 'ocean' | 'forest' | 'white') => {
        if (preset === 'dark') {
            setPrimaryColor("24 100% 52%");
            setBgColor("240 10% 2%");
            setSidebarMenuColor("0 0% 2%");
            setSidebarSubmenuColor("0 0% 5%");
            setBorderColor("0 0% 100% / 0.1");
            setCardColor("0 0% 100% / 0.05");
            setHeaderBgColor("240 10% 2%");
            setHeaderIconsColor("0 0% 100%");
            setIconsGlobalColor("24 100% 52%");

            // Default Font Sizes for presets
            setFsBase(14);
            setFsTitle(24);
            setFsCardTitle(18);
            setFsMenu(13);
            setFsSubmenu(14);
            setFsSmall(12);
            setFsStats(32);
            setFsSubtitle(14);
        } else if (preset === 'ocean') {
            setPrimaryColor("210 100% 50%");
            setBgColor("215 28% 10%");
            setSidebarMenuColor("215 28% 7%");
            setSidebarSubmenuColor("215 28% 12%");
            setBorderColor("210 50% 50% / 0.2");
            setCardColor("215 30% 15% / 0.4");
            setHeaderBgColor("215 28% 10%");
            setHeaderIconsColor("210 50% 90%");
            setIconsGlobalColor("210 100% 50%");

            setFsBase(14);
            setFsTitle(24);
            setFsCardTitle(18);
            setFsMenu(13);
            setFsSubmenu(14);
        } else if (preset === 'forest') {
            setPrimaryColor("142 71% 45%");
            setBgColor("150 10% 5%");
            setSidebarMenuColor("150 15% 3%");
            setSidebarSubmenuColor("150 15% 8%");
            setBorderColor("142 50% 50% / 0.15");
            setCardColor("150 20% 10% / 0.3");
            setHeaderBgColor("150 10% 5%");
            setHeaderIconsColor("142 50% 90%");
            setIconsGlobalColor("142 71% 45%");

            setFsBase(14);
            setFsTitle(24);
            setFsCardTitle(18);
            setFsMenu(13);
            setFsSubmenu(14);
        } else if (preset === 'white') {
            setPrimaryColor("24 100% 52%");
            setBgColor("0 0% 100%");
            setSidebarMenuColor("0 0% 98%");
            setSidebarSubmenuColor("0 0% 95%");
            setBorderColor("0 0% 0% / 0.1");
            setCardColor("0 0% 0% / 0.03");
            setHeaderBgColor("0 0% 100%");
            setHeaderIconsColor("0 0% 10%");
            setIconsGlobalColor("24 100% 52%");

            setFsBase(14);
            setFsTitle(24);
            setFsCardTitle(18);
            setFsMenu(13);
            setFsSubmenu(14);
        }
        toast.success(`Tema ${preset} aplicado! Clique em Salvar.`);
    };

    const handleDomainCheck = async () => {
        if (!customDomain) return;
        toast.info("Verificando disponibilidade de DNS...");
        try {
            const available = await agencyService.checkDomainAvailability(customDomain);
            if (available) {
                toast.success(`Domínio ${customDomain} disponível para vínculo!`);
            }
        } catch (error) {
            toast.error("Falha ao verificar domínio.");
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="SETUP"
                titleAccent="WHITE LABEL"
                subtitle="Personalize a experiência do seu cliente com sua marca exclusiva"
                actions={[
                    {
                        label: 'Salvar Alterações',
                        icon: Save,
                        variant: 'primary',
                        onClick: handleSave,
                        isLoading: saving
                    }
                ]}
            />

            {loading && <div className="text-xs text-muted-foreground animate-pulse absolute top-4 right-8">Sincronizando...</div>}

            <Tabs defaultValue="branding" className="w-full space-y-8">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/10 p-1 h-auto">
                    <TabsTrigger value="branding" className="px-6 py-2 gap-2 uppercase text-xs font-bold tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Palette className="w-4 h-4" />
                        Identidade Visual
                    </TabsTrigger>
                    <TabsTrigger value="domain" className="px-6 py-2 gap-2 uppercase text-xs font-bold tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Globe className="w-4 h-4" />
                        Domínio & Acesso
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="branding">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
                        {/* LEFT: CONTROLS */}
                        <div className="xl:col-span-4 h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-10 custom-scrollbar space-y-6">

                            {/* PRESETS PANEL */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Presets de Tema</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => applyPreset('dark')} className="px-3 py-2 bg-zinc-900 border border-white/10 rounded hover:bg-white/5 text-[10px] text-zinc-400 uppercase font-bold text-center transition-all">
                                        Padrão Dark
                                    </button>
                                    <button onClick={() => applyPreset('ocean')} className="px-3 py-2 bg-blue-900/20 border border-blue-500/20 rounded hover:bg-blue-500/10 text-[10px] text-blue-400 uppercase font-bold text-center transition-all">
                                        Ocean Blue
                                    </button>
                                    <button onClick={() => applyPreset('forest')} className="px-3 py-2 bg-green-900/20 border border-green-500/20 rounded hover:bg-green-500/10 text-[10px] text-green-400 uppercase font-bold text-center transition-all">
                                        Forest Green
                                    </button>
                                    <button onClick={() => applyPreset('white')} className="px-3 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-[10px] text-white uppercase font-bold text-center transition-all">
                                        Pure White
                                    </button>
                                </div>
                            </div>

                            {/* LOGOS & ASSETS */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <LayoutDashboard className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Logos do Sistema</h3>
                                </div>
                                <div className="space-y-4">
                                    <UiAssetUploader
                                        label="Sua Logo (Dashboard)"
                                        value={logoUrl}
                                        onChange={setLogoUrl}
                                    />
                                </div>
                            </div>

                            {/* COLORS PANEL */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Sliders className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Cores da Interface</h3>
                                </div>

                                <div className="space-y-4">
                                    <ColorPicker
                                        label="Cor Primária (Destaques)"
                                        value={primaryColor}
                                        onChange={setPrimaryColor}
                                    />
                                    <ColorPicker
                                        label="Fundo do Workspace"
                                        value={bgColor}
                                        onChange={setBgColor}
                                    />
                                    <ColorPicker
                                        label="Fundo do Menu Lateral"
                                        value={sidebarMenuColor}
                                        onChange={setSidebarMenuColor}
                                    />
                                    <ColorPicker
                                        label="Fundo do Submenu"
                                        value={sidebarSubmenuColor}
                                        onChange={setSidebarSubmenuColor}
                                    />
                                </div>
                            </div>

                            {/* ADVANCED UI COLORS */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Detalhes de UI</h3>
                                </div>
                                <div className="space-y-4">
                                    <ColorPicker
                                        label="Bordas & Linhas"
                                        value={borderColor}
                                        onChange={setBorderColor}
                                    />
                                    <ColorPicker
                                        label="Fundo dos Cards"
                                        value={cardColor}
                                        onChange={setCardColor}
                                    />
                                    <ColorPicker
                                        label="Fundo do Cabeçalho"
                                        value={headerBgColor}
                                        onChange={setHeaderBgColor}
                                    />
                                    <ColorPicker
                                        label="Ícones do Cabeçalho"
                                        value={headerIconsColor}
                                        onChange={setHeaderIconsColor}
                                    />
                                    <ColorPicker
                                        label="Cor de Ícones Global"
                                        value={iconsGlobalColor}
                                        onChange={setIconsGlobalColor}
                                    />
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Activity className="w-4 h-4 text-primary" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status & Semântica</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        <ColorPicker
                                            label="Sucesso / Ativo"
                                            value={successColor}
                                            onChange={setSuccessColor}
                                        />
                                        <ColorPicker
                                            label="Aviso / Pendente"
                                            value={warningColor}
                                            onChange={setWarningColor}
                                        />
                                        <ColorPicker
                                            label="Erro / Crítico"
                                            value={errorColor}
                                            onChange={setErrorColor}
                                        />
                                        <ColorPicker
                                            label="Informações"
                                            value={infoColor}
                                            onChange={setInfoColor}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* TYPOGRAPHY & SHAPE */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <MousePointerClick className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Forma & Estilo</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase text-zinc-500">Arredondamento (Radius)</Label>
                                            <span className="text-[10px] font-mono text-white">{Math.round(radius)}px</span>
                                        </div>
                                        <Slider
                                            max={24}
                                            step={1}
                                            value={[radius]}
                                            onValueChange={(vals) => setRadius(vals[0])}
                                            className="accent-primary py-1"
                                        />
                                    </div>

                                    {/* Glass Effect */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-3 h-3 text-primary" />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Efeito Vidro (Glass)</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label className="text-[10px] uppercase text-zinc-500">Intensidade do Blur</Label>
                                                    <span className="text-[10px] font-mono text-white">{glassBlur}px</span>
                                                </div>
                                                <Slider
                                                    min={0} max={40} step={1}
                                                    value={[glassBlur]}
                                                    onValueChange={(v) => setGlassBlur(v[0])}
                                                    className="py-1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label className="text-[10px] uppercase text-zinc-500">Opacidade do Vidro</Label>
                                                    <span className="text-[10px] font-mono text-white">{Math.round(glassOpacity * 100)}%</span>
                                                </div>
                                                <Slider
                                                    min={0} max={0.2} step={0.01}
                                                    value={[glassOpacity]}
                                                    onValueChange={(v) => setGlassOpacity(v[0])}
                                                    className="py-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase text-zinc-500">Fonte do Sistema</Label>
                                        <Select value={fontFamily} onValueChange={setFontFamily}>
                                            <SelectTrigger className="h-9 bg-black/40 border-white/10 text-xs text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#111] border-white/10">
                                                <SelectItem value="Inter">Inter (Padrão)</SelectItem>
                                                <SelectItem value="Roboto">Roboto</SelectItem>
                                                <SelectItem value="Poppins">Poppins</SelectItem>
                                                <SelectItem value="Outfit">Outfit (Modern)</SelectItem>
                                                <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Font Sizes Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Menus/Sidebar</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsMenu}px</span>
                                            </div>
                                            <Slider
                                                min={8} max={20} step={1}
                                                value={[fsMenu]}
                                                onValueChange={(v) => setFsMenu(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Submenus</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsSubmenu}px</span>
                                            </div>
                                            <Slider
                                                min={10} max={24} step={1}
                                                value={[fsSubmenu]}
                                                onValueChange={(v) => setFsSubmenu(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Texto Base</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsBase}px</span>
                                            </div>
                                            <Slider
                                                min={10} max={18} step={1}
                                                value={[fsBase]}
                                                onValueChange={(v) => setFsBase(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Pequeno/Hints</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsSmall}px</span>
                                            </div>
                                            <Slider
                                                min={8} max={14} step={1}
                                                value={[fsSmall]}
                                                onValueChange={(v) => setFsSmall(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: LIVE PREVIEW */}
                        <div className="xl:col-span-8 sticky top-6">
                            <div className="flex justify-end gap-2 mb-4">
                                <div className="bg-zinc-900 p-1 rounded-lg border border-white/10 flex">
                                    <button
                                        onClick={() => setPreviewMode('desktop')}
                                        className={cn(
                                            "p-2 rounded text-zinc-400 hover:text-white transition-all",
                                            previewMode === 'desktop' && "bg-white/10 text-white shadow-sm"
                                        )}
                                    >
                                        <Monitor className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('mobile')}
                                        className={cn(
                                            "p-2 rounded text-zinc-400 hover:text-white transition-all",
                                            previewMode === 'mobile' && "bg-white/10 text-white shadow-sm"
                                        )}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className={cn(
                                "rounded-xl overflow-hidden border border-white/10 bg-[#09090b] relative flex flex-col transition-all duration-500 mx-auto shadow-2xl",
                                previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full h-[calc(100vh-220px)]"
                            )}>
                                {/* Browser Mock Header */}
                                <div className="bg-[#18181b] px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0">
                                    <div className="flex gap-1.5 opacity-50">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-30">
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white">Live Preview Interativo</span>
                                    </div>
                                </div>

                                {/* PREVIEW CONTENT MOCK */}
                                <div className="flex-1 overflow-hidden relative flex">
                                    {/* SANDBOX STYLES */}
                                    <style>{`
                                        .agency-preview {
                                            --background: hsl(${bgColor});
                                            --sidebar-menu: hsl(${sidebarMenuColor});
                                            --sidebar-submenu: hsl(${sidebarSubmenuColor});
                                            --primary: hsl(${primaryColor});
                                            --border: ${borderColor.includes('hsl') ? borderColor : `hsl(${borderColor})`};
                                            --card: ${cardColor.includes('hsl') ? cardColor : `hsl(${cardColor})`};
                                            /* --hover used for simulated states */
                                            --hover-bg: ${hoverColor.includes('hsl') ? hoverColor : `hsl(${hoverColor})`};
                                            --header-bg: hsl(${headerBgColor});
                                            --header-icons: ${headerIconsColor.includes('hsl') ? headerIconsColor : `hsl(${headerIconsColor})`};
                                            --icons-global: hsl(${iconsGlobalColor});
                                            --radius: ${radius}px;
                                            --font-family: '${fontFamily}', sans-serif;

                                            /* Font Sizes */
                                            --fs-menu: ${fsMenu}px;
                                            --fs-submenu: ${fsSubmenu}px;
                                            --fs-base: ${fsBase}px;
                                            --fs-title: ${fsTitle}px;
                                            --fs-card-title: ${fsCardTitle}px;
                                            --fs-stats: ${fsStats}px;
                                            --fs-small: ${fsSmall}px;
                                            --fs-subtitle: ${fsSubtitle}px;
                                        }
                                        .agency-preview { font-family: var(--font-family) !important; }
                                        .agency-preview .text-menu { font-size: var(--fs-menu) !important; }
                                        .agency-preview .text-submenu { font-size: var(--fs-submenu) !important; }
                                        .agency-preview .text-base { font-size: var(--fs-base) !important; }
                                        .agency-preview .text-title { font-size: var(--fs-title) !important; }
                                        .agency-preview .text-stats { font-size: var(--fs-stats) !important; }
                                        .agency-preview .text-small { font-size: var(--fs-small) !important; }
                                        .agency-preview .text-subtitle { font-size: var(--fs-subtitle) !important; }
                                        .agency-preview .text-card-title { font-size: var(--fs-card-title) !important; }

                                        .agency-preview .glass-mock { 
                                            background-color: hsla(0, 0%, 100%, ${glassOpacity}) !important;
                                            backdrop-filter: blur(${glassBlur}px) !important;
                                            border: 1px solid rgba(255,255,255,0.1) !important;
                                        }

                                        .agency-preview .badge-success {
                                            background-color: hsla(${successColor.includes(' ') ? successColor : `hsl(${successColor})`}, 0.1) !important;
                                            color: ${successColor.includes(' ') ? `hsl(${successColor})` : successColor} !important;
                                            border-color: hsla(${successColor.includes(' ') ? successColor : `hsl(${successColor})`}, 0.2) !important;
                                        }
                                    `}</style>

                                    <div className="agency-preview flex flex-col w-full h-full bg-[var(--background)]">
                                        {/* SYSTEM HEADER MOCK (FULL WIDTH) */}
                                        <div className="h-12 bg-[var(--header-bg)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 relative z-20">
                                            <div className="flex items-center gap-4 text-[var(--header-icons)]">
                                                <div className="w-8 h-8 rounded-[8px] bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                                                    {logoUrl ? <img src={logoUrl} className="w-5 h-5 object-contain" /> : <span className="font-black text-white text-sm">U</span>}
                                                </div>
                                                <div className="h-3 w-24 bg-current opacity-10 rounded hidden md:block" />
                                            </div>
                                            <div className="flex items-center gap-3 text-[var(--header-icons)]">
                                                <div className="h-2 w-32 bg-current opacity-5 rounded-full mr-4 hidden md:block" />
                                                <Globe className="w-4 h-4 opacity-50" />
                                                <Users className="w-4 h-4 opacity-50" />
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[var(--border)] flex items-center justify-center text-[10px] text-white">
                                                    JD
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 overflow-hidden">
                                            {/* SIDEBAR MOCK */}
                                            <div className="flex h-full shrink-0">
                                                {/* Column 1: Main Menu */}
                                                <div className="w-14 bg-[var(--sidebar-menu)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-4">
                                                    <div className="flex flex-col items-center gap-1 group">
                                                        <div className="w-9 h-9 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center">
                                                            <LayoutDashboard className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[var(--primary)] font-bold text-menu leading-none">SaaS</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 group opacity-50">
                                                        <div className="w-9 h-9 rounded-lg bg-transparent text-white flex items-center justify-center">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-white font-bold text-menu leading-none">CRM</span>
                                                    </div>
                                                </div>
                                                {/* Column 2: Submenu Context */}
                                                <div className="w-48 bg-[var(--sidebar-submenu)] border-r border-[var(--border)] p-4 flex flex-col gap-6 hidden md:flex animate-in slide-in-from-left duration-300">
                                                    <div className="h-3 w-20 bg-white/5 rounded-sm mb-2" />
                                                    <div className="space-y-1">
                                                        <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-white/5 text-white border border-white/5">
                                                            <Activity className="w-3.5 h-3.5 text-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                                                            <span className="text-submenu font-semibold">Dashboard</span>
                                                        </div>
                                                        <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-transparent text-muted-foreground group">
                                                            <Users className="w-3.5 h-3.5 opacity-40" />
                                                            <span className="text-submenu font-semibold">Clientes</span>
                                                        </div>
                                                        <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-transparent text-muted-foreground group">
                                                            <Settings2 className="w-3.5 h-3.5 opacity-40" />
                                                            <span className="text-submenu font-semibold">Configurações</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CONTENT AREA MOCK */}
                                            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h1 className="text-title font-bold text-white mb-1 leading-none">Visão Geral da Agência</h1>
                                                        <p className="text-subtitle text-zinc-400">Teste o efeito Vidro e as Cores de Status abaixo</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="glass-mock p-5 rounded-[var(--radius)] flex flex-col gap-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--primary)]/10 flex items-center justify-center">
                                                                <Zap className="w-5 h-5 text-[var(--primary)]" />
                                                            </div>
                                                            <div className="badge-success px-3 py-1 rounded-full text-[9px] font-black uppercase">Ativo</div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-card-title font-bold text-white mb-1">Efeito de Vidro Dinâmico</h3>
                                                            <p className="text-small text-zinc-400">Ajuste o Blur ({glassBlur}px) e a Opacidade ({Math.round(glassOpacity * 100)}%) acima.</p>
                                                        </div>
                                                    </div>

                                                    <div className="glass-mock p-5 rounded-[var(--radius)] flex flex-col justify-center">
                                                        <div className="text-stats font-black text-white leading-none">R$ 12.450</div>
                                                        <div className="text-small text-zinc-500 uppercase font-black tracking-widest mt-2">Ganhos Mensais</div>
                                                    </div>
                                                </div>

                                                <div className="glass-mock rounded-[var(--radius)] overflow-hidden border border-white/5">
                                                    <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                                                        <span>Logs de Atividade</span>
                                                        <span>Status</span>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {[1, 2].map(i => (
                                                            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                                        <Activity className="w-4 h-4 opacity-30" />
                                                                    </div>
                                                                    <div className="h-2 w-32 bg-white/10 rounded" />
                                                                </div>
                                                                <div className="badge-success px-2 py-0.5 rounded text-[8px] font-bold">SUCESSO</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="domain">
                    <Card className="p-8 bg-black/40 border-white/10 space-y-8 max-w-2xl mx-auto shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/10 border border-primary/20">
                                <Globe className="w-7 h-7 text-primary mt-1" />
                                <div className="space-y-1">
                                    <h3 className="font-black text-primary uppercase text-xs tracking-widest">Acesso White Label</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Configure seu próprio domínio para que seus clientes acessem a plataforma sob sua marca.
                                        Ex: <code>app.suaagencia.com.br</code>
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <Label htmlFor="domain" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Seu Subdomínio / Domínio</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <Input
                                            id="domain"
                                            placeholder="Ex: app.agencia.com"
                                            className="bg-black/50 border-white/10 pl-10 h-11 text-sm font-bold placeholder:text-zinc-800"
                                            value={customDomain}
                                            onChange={(e) => setCustomDomain(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="border-white/10 hover:bg-white/5 h-11 px-6 uppercase text-xs font-bold gap-2" onClick={handleDomainCheck}>
                                        <RotateCw className="w-4 h-4" />
                                        Verificar DNS
                                    </Button>
                                </div>
                                <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 space-y-2">
                                    <p className="text-[10px] text-zinc-500 uppercase font-black">Instruções de Apontamento</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono text-zinc-400">Tipo: <span className="text-white">CNAME</span></span>
                                        <span className="text-[11px] font-mono text-zinc-400">Valor: <span className="text-primary">cname.uniafy.com</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 border-t border-white/5">
                            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 h-11 shadow-lg shadow-primary/20">
                                {saving ? "Processando..." : "Salvar Configuração"}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
