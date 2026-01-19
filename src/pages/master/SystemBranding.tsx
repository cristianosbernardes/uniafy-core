import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Palette, LayoutDashboard, Save, Sliders, MousePointerClick, Globe, RotateCcw, LayoutTemplate, Smartphone, Monitor, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useBranding } from "@/contexts/BrandingContext";
import { ColorPicker } from "@/components/ui/color-picker";
import { UiAssetUploader } from "@/components/ui/branding-uploader";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemBranding() {
    const { branding, refreshBranding } = useBranding();
    const [loading, setLoading] = useState(false);

    // Color State
    const [primaryColor, setPrimaryColor] = useState("24 100% 52%");
    const [bgColor, setBgColor] = useState("240 10% 2%");
    const [sidebarColor, setSidebarColor] = useState("0 0% 2%");

    // Advanced UI Colors
    const [borderColor, setBorderColor] = useState("0 0% 100% / 0.1"); // white/10 equivalent
    const [cardColor, setCardColor] = useState("0 0% 100% / 0.05");   // white/5 equivalent
    const [hoverColor, setHoverColor] = useState("24 100% 52% / 0.1"); // primary/10 equivalent

    // Limits/Assets State
    const [logoUrl, setLogoUrl] = useState("");

    // Advanced Branding States
    const [faviconUrl, setFaviconUrl] = useState('');
    const [loginBgUrl, setLoginBgUrl] = useState('');
    const [loginOverlayColor, setLoginOverlayColor] = useState('#000000');
    const [loginOverlayOpacity, setLoginOverlayOpacity] = useState(0.8);
    const [loginTitle, setLoginTitle] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const [loginLogoUrl, setLoginLogoUrl] = useState("");
    const [loginLayout, setLoginLayout] = useState<'center' | 'split'>('center');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // UI/Typography State
    const [radius, setRadius] = useState(8); // Default 8px (0.5rem)
    const [fontFamily, setFontFamily] = useState("Inter");
    const [fsBase, setFsBase] = useState(14);
    const [fsTitle, setFsTitle] = useState(24); // Page Headers
    const [fsCardTitle, setFsCardTitle] = useState(18); // Card Headers
    const [fsMenu, setFsMenu] = useState(13); // Sidebar
    const [fsSmall, setFsSmall] = useState(12);
    const [fsStats, setFsStats] = useState(32); // KPI Numbers
    const [fsSubtitle, setFsSubtitle] = useState(14); // Descriptions

    useEffect(() => {
        if (branding) {
            setPrimaryColor(branding.colors?.primary || "24 100% 52%");
            setBgColor(branding.colors?.background || "240 10% 2%");
            setSidebarColor(branding.colors?.sidebar || "0 0% 2%");

            // Advanced colors
            if (branding.colors?.border) setBorderColor(branding.colors.border);
            if (branding.colors?.card) setCardColor(branding.colors.card);
            if (branding.colors?.hover) setHoverColor(branding.colors.hover);

            setLogoUrl(branding.logo_url || "");

            // Advanced
            setFaviconUrl(branding.favicon_url || '');
            setLoginBgUrl(branding.login?.bg_url || '');
            setLoginOverlayColor(branding.login?.overlay_color || '#000000');
            setLoginOverlayOpacity(branding.login?.overlay_opacity ?? 0.8);
            setLoginTitle(branding.login?.title || "");
            setLoginMessage(branding.login?.message || "");
            setLoginTitle(branding.login?.title || "");
            setLoginMessage(branding.login?.message || "");
            setLoginLogoUrl(branding.login?.logo_url || "");
            setLoginLayout(branding.login?.layout || 'center');

            if (branding.ui) {
                // Determine Radius: if stored in rem (<= 2 usually), convert to px. If > 2, assume px (legacy or future proof)
                // Assuming always stored as REM for now based on context logic.
                const r = branding.ui.radius !== undefined ? branding.ui.radius : 0.5;
                setRadius(r * 16); // Convert REM to PX for UI

                if (branding.ui.fontFamily) setFontFamily(branding.ui.fontFamily);
                if (branding.ui.fontSizes) {
                    setFsBase(branding.ui.fontSizes.base || 14);
                    setFsTitle(branding.ui.fontSizes.titles || 24);
                    setFsCardTitle(branding.ui.fontSizes.cardTitles || 18);
                    setFsMenu(branding.ui.fontSizes.menu || 13);
                    setFsSmall(branding.ui.fontSizes.small || 12);
                    setFsStats(branding.ui.fontSizes.stats || 32);
                    setFsSubtitle(branding.ui.fontSizes.subtitles || 14);
                }
            }
        }
    }, [branding]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedBranding = {
                colors: {
                    primary: primaryColor,
                    background: bgColor,
                    sidebar: sidebarColor,
                    sidebar_active: primaryColor,
                    border: borderColor,
                    card: cardColor,
                    hover: hoverColor
                },
                logo_url: logoUrl,
                favicon_url: faviconUrl,
                login: {
                    bg_url: loginBgUrl,
                    overlay_color: loginOverlayColor,
                    overlay_opacity: loginOverlayOpacity,
                    title: loginTitle,
                    message: loginMessage,
                    title: loginTitle,
                    message: loginMessage,
                    logo_url: loginLogoUrl,
                    layout: loginLayout
                },
                ui: {
                    radius: radius / 16, // Convert PX back to REM for storage
                    fontFamily,
                    fontSizes: {
                        base: fsBase,
                        titles: fsTitle,
                        cardTitles: fsCardTitle,
                        menu: fsMenu,
                        small: fsSmall,
                        stats: fsStats,
                        subtitles: fsSubtitle
                    }
                }
            };

            const { error } = await supabase
                .from('master_config')
                .update({ branding: updatedBranding })
                .eq('id', 1);

            if (error) throw error;

            await refreshBranding();
            toast.success('Identidade Visual atualizada com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar branding:', error);
            toast.error('Erro ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Tem certeza que deseja restaurar os padrões visuais do sistema?')) return;

        setLoading(true);
        try {
            const defaultBranding = {
                colors: { primary: "24 100% 52%", background: "240 10% 2%", sidebar: "0 0% 2%", sidebar_active: "24 100% 52%", border: "0 0% 100% / 0.1", card: "0 0% 100% / 0.05", hover: "24 100% 52% / 0.1" },
                logo_url: "",
                favicon_url: "",
                login: { bg_url: "", overlay_color: "#000000", overlay_opacity: 0.8, title: "", message: "", logo_url: "", layout: "center" as const },
                ui: { radius: 0.5, fontFamily: "Inter", fontSizes: { base: 14, titles: 24, cardTitles: 18, menu: 13, small: 12, stats: 32, subtitles: 14 } }
            };

            const { error } = await supabase
                .from('master_config')
                .update({ branding: defaultBranding })
                .eq('id', 1);

            if (error) throw error;
            await refreshBranding();
            toast.success('Padrões restaurados com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao restaurar padrões.');
        } finally {
            setLoading(false);
        }
    };

    const applyPreset = (preset: 'dark' | 'ocean' | 'forest') => {
        if (preset === 'dark') {
            setPrimaryColor("24 100% 52%");
            setBgColor("240 10% 2%");
            setSidebarColor("0 0% 2%");
            setBorderColor("0 0% 100% / 0.1");
            setCardColor("0 0% 100% / 0.05");
        } else if (preset === 'ocean') {
            setPrimaryColor("210 100% 50%");
            setBgColor("215 28% 10%");
            setSidebarColor("215 28% 7%");
            setBorderColor("210 50% 50% / 0.2");
            setCardColor("215 30% 15% / 0.4");
        } else if (preset === 'forest') {
            setPrimaryColor("142 71% 45%");
            setBgColor("150 10% 5%");
            setSidebarColor("150 15% 3%");
            setBorderColor("142 50% 50% / 0.15");
            setCardColor("150 20% 10% / 0.3");
        }
        toast.success(`Tema ${preset} aplicado! Clique em Salvar.`);
    };

    return (
        <div className="space-y-8 pb-1">
            <PageHeader
                title="IDENTIDADE"
                titleAccent="VISUAL"
                actions={[
                    {
                        label: 'Restaurar Padrões',
                        icon: RotateCcw,
                        variant: 'outline',
                        onClick: handleReset
                    },
                    {
                        label: 'Salvar',
                        icon: Save,
                        variant: 'primary',
                        onClick: handleSave,
                        isLoading: loading
                    }
                ]}
            />

            <Tabs defaultValue="identity" className="w-full space-y-8">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/10 p-1">
                    <TabsTrigger value="identity" className="data-[state=active]:bg-primary data-[state=active]:text-white uppercase text-xs font-bold tracking-widest">Identidade</TabsTrigger>
                    <TabsTrigger value="styles" className="data-[state=active]:bg-primary data-[state=active]:text-white uppercase text-xs font-bold tracking-widest">Estilo & UI</TabsTrigger>
                </TabsList>

                <TabsContent value="identity">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* LEFT: CONTROLS */}
                        <div className="xl:col-span-4 space-y-6">

                            {/* METADADOS / FAVICON */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Metadados & Favicon</h3>
                                </div>
                                <div className="space-y-4">
                                    <UiAssetUploader
                                        label="Ícone do Site (Favicon)"
                                        value={faviconUrl}
                                        onChange={setFaviconUrl}
                                    />
                                </div>
                            </div>

                            {/* LOGOS */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <LayoutDashboard className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Logos do Sistema</h3>
                                </div>
                                <div className="space-y-4">
                                    <UiAssetUploader
                                        label="Logo do Header (Dashboard)"
                                        value={logoUrl}
                                        onChange={setLogoUrl}
                                    />
                                    <UiAssetUploader
                                        label="Logo da Tela de Login"
                                        value={loginLogoUrl}
                                        onChange={setLoginLogoUrl}
                                    />
                                </div>
                            </div>

                            {/* LOGIN LAYOUT SELECTOR */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <LayoutTemplate className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Layout de Login</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setLoginLayout('center')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                            loginLayout === 'center' ? "border-primary bg-primary/10" : "border-white/10 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-full aspect-video bg-zinc-900 rounded border border-white/10 relative flex items-center justify-center">
                                            <div className="w-1/3 h-2/3 bg-white/10 rounded border border-white/5" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">Card Central</span>
                                    </button>
                                    <button
                                        onClick={() => setLoginLayout('split')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                            loginLayout === 'split' ? "border-primary bg-primary/10" : "border-white/10 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-full aspect-video bg-zinc-900 rounded border border-white/10 relative flex">
                                            <div className="w-1/2 h-full bg-white/5 border-r border-white/5" />
                                            <div className="w-1/2 h-full flex items-center justify-center">
                                                <div className="w-2/3 h-1/2 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">Split Screen</span>
                                    </button>
                                </div>
                            </div>

                            {/* LOGIN TEXTS */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <MousePointerClick className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Textos de Boas-Vindas</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500">Título Principal</Label>
                                        <Input
                                            value={loginTitle}
                                            onChange={(e) => setLoginTitle(e.target.value)}
                                            placeholder="Ex: Bem-vindo à Uniafy"
                                            className="bg-black/20 border-white/10 text-white text-xs h-9 placeholder:text-zinc-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500">Subtítulo / Mensagem</Label>
                                        <Input
                                            value={loginMessage}
                                            onChange={(e) => setLoginMessage(e.target.value)}
                                            placeholder="Ex: Entre para acessar sua conta"
                                            className="bg-black/20 border-white/10 text-white text-xs h-9 placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* LOGIN BACKGROUND & OVERLAY */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Estilo do Login</h3>
                                </div>
                                <div className="space-y-4">
                                    <UiAssetUploader
                                        label="Background do Login"
                                        value={loginBgUrl}
                                        onChange={setLoginBgUrl}
                                    />
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500">Overlay (Máscara)</Label>
                                        <div className="flex gap-2">
                                            <div className="w-full">
                                                <ColorPicker
                                                    label="Cor da Máscara"
                                                    value={loginOverlayColor}
                                                    onChange={setLoginOverlayColor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase text-zinc-500">Opacidade: {Math.round(loginOverlayOpacity * 100)}%</Label>
                                        </div>
                                        <Slider
                                            min={0} max={1} step={0.05}
                                            value={[loginOverlayOpacity]}
                                            onValueChange={(v) => setLoginOverlayOpacity(v[0])}
                                            className="py-1"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: IDENTITY PREVIEW */}
                        <div className="xl:col-span-8 space-y-4">
                            <div className="flex justify-end gap-2">
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
                                "rounded-xl overflow-hidden border border-white/10 bg-black relative flex flex-col transition-all duration-500 mx-auto",
                                previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full h-[calc(100vh-140px)]"
                            )}>
                                {/* Browser Tab Mock */}
                                <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-white/5 shrink-0">
                                    <div className="flex gap-1.5 opacity-50 mr-4">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div className="bg-[#333] rounded-t w-48 py-1.5 px-3 flex items-center gap-2 text-[10px] text-zinc-300 relative top-1">
                                        {faviconUrl ? (
                                            <img src={faviconUrl} className="w-3 h-3 object-contain" />
                                        ) : (
                                            <div className="w-3 h-3 bg-white/10 rounded-sm" />
                                        )}
                                        <span className="truncate">Uniafy - Sistema</span>
                                    </div>
                                </div>

                                {/* Login Preview Mock */}
                                <div className="flex-1 relative flex items-center justify-center p-12 bg-zinc-900/50 overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                                        style={{
                                            backgroundImage: loginBgUrl ? `url(${loginBgUrl})` : undefined,
                                            // Live Preview of Split vs Center Layout logic (mock)
                                            width: loginLayout === 'split' && previewMode === 'desktop' ? '50%' : '100%'
                                        }}
                                    >
                                        <div className="absolute inset-0" style={{ backgroundColor: loginOverlayColor, opacity: loginOverlayOpacity }}></div>
                                    </div>

                                    {/* Additional BG for Split Mode Right Side (Dark Default) */}
                                    {loginLayout === 'split' && (
                                        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#0a0a0a] z-0 hidden lg:block" />
                                    )}

                                    <div className={cn(
                                        "relative z-10 w-full max-w-sm bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8 transition-all",
                                        loginLayout === 'split' && previewMode === 'desktop' ? "translate-x-[50%] bg-[#111] border-none shadow-none" : ""
                                    )}>
                                        <div className="flex justify-center">
                                            {loginLogoUrl || logoUrl ? (
                                                <img src={loginLogoUrl || logoUrl} alt="Logo" className="h-10 object-contain" />
                                            ) : (
                                                <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1 text-center">
                                                <h1 className="text-2xl font-semibold text-white tracking-tight">
                                                    {loginTitle || "Bem-vindo de volta"}
                                                </h1>
                                                <p className="text-sm text-zinc-400">
                                                    {loginMessage || "Entre com suas credenciais para acessar."}
                                                </p>
                                            </div>

                                            <div className="space-y-4 opacity-50 pointer-events-none select-none">
                                                <div className="space-y-2">
                                                    <div className="h-9 w-full bg-white/5 rounded border border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-9 w-full bg-white/5 rounded border border-white/10" />
                                                </div>
                                                <div className="h-10 w-full bg-primary rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </TabsContent>

                <TabsContent value="styles">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* LEFT: STYLE CONTROLS */}
                        <div className="xl:col-span-4 space-y-6">

                            {/* PRESETS PANEL */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Presets de Tema</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => applyPreset('dark')} className="px-3 py-2 bg-zinc-900 border border-white/10 rounded hover:bg-white/5 text-[10px] text-zinc-400 uppercase font-bold text-center">
                                        Padrão
                                    </button>
                                    <button onClick={() => applyPreset('ocean')} className="px-3 py-2 bg-blue-900/20 border border-blue-500/20 rounded hover:bg-blue-500/10 text-[10px] text-blue-400 uppercase font-bold text-center">
                                        Ocean
                                    </button>
                                    <button onClick={() => applyPreset('forest')} className="px-3 py-2 bg-green-900/20 border border-green-500/20 rounded hover:bg-green-500/10 text-[10px] text-green-400 uppercase font-bold text-center">
                                        Forest
                                    </button>
                                </div>
                            </div>
                            {/* COLORS PANEL */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Paleta de Cores</h3>
                                </div>

                                <div className="space-y-4">
                                    <ColorPicker
                                        label="Cor Primária (Brand)"
                                        value={primaryColor}
                                        onChange={setPrimaryColor}
                                    />

                                    <ColorPicker
                                        label="Background (Fundo)"
                                        value={bgColor}
                                        onChange={setBgColor}
                                    />

                                    <ColorPicker
                                        label="Sidebar & Paineis"
                                        value={sidebarColor}
                                        onChange={setSidebarColor}
                                    />
                                </div>
                            </div>

                            {/* ADVANCED UI COLORS */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Sliders className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">UI Completa (Advanced)</h3>
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
                                        label="Efeito Hover (Foco)"
                                        value={hoverColor}
                                        onChange={setHoverColor}
                                    />
                                </div>
                            </div>

                            {/* TYPOGRAPHY & SHAPE PANEL */}
                            <div className="card-industrial p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <Sliders className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Forma & Tipografia</h3>
                                </div>

                                <div className="space-y-6">
                                    {/* Font Family */}
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
                                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Font Sizes Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Títulos (H1)</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsTitle}px</span>
                                            </div>
                                            <Slider
                                                min={16} max={48} step={1}
                                                value={[fsTitle]}
                                                onValueChange={(v) => setFsTitle(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Números (KPIs)</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsStats}px</span>
                                            </div>
                                            <Slider
                                                min={16} max={56} step={1}
                                                value={[fsStats]}
                                                onValueChange={(v) => setFsStats(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Títulos de Cards</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsCardTitle}px</span>
                                            </div>
                                            <Slider
                                                min={14} max={32} step={1}
                                                value={[fsCardTitle]}
                                                onValueChange={(v) => setFsCardTitle(v[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-[10px] uppercase text-zinc-500">Menus/Sidebar</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsMenu}px</span>
                                            </div>
                                            <Slider
                                                min={10} max={16} step={1}
                                                value={[fsMenu]}
                                                onValueChange={(v) => setFsMenu(v[0])}
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
                                                <Label className="text-[10px] uppercase text-zinc-500">Subtítulos/Desc.</Label>
                                                <span className="text-[10px] font-mono text-zinc-400">{fsSubtitle}px</span>
                                            </div>
                                            <Slider
                                                min={10} max={18} step={1}
                                                value={[fsSubtitle]}
                                                onValueChange={(v) => setFsSubtitle(v[0])}
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

                                    {/* Radius */}
                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase text-zinc-500">Arredondamento (Radius)</Label>
                                            <span className="text-[10px] font-mono text-white">{Math.round(radius)}px</span>
                                        </div>
                                        <Slider
                                            defaultValue={[8]}
                                            max={32}
                                            step={1}
                                            value={[radius]}
                                            onValueChange={(vals) => setRadius(vals[0])}
                                            className="accent-primary py-1"
                                        />
                                        <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-mono">
                                            <span>Quadrado (0px)</span>
                                            <span>Redondo (32px)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PREVIEW */}
                        <div className="xl:col-span-8">
                            {/* LIVE PREVIEW CONTAINER */}
                            <div
                                className={cn(
                                    "border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 relative bg-[#09090b] flex flex-col mx-auto",
                                    previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full h-[calc(100vh-90px)]"
                                )}
                            >
                                {/* Browser Mock Header */}
                                <div className="bg-[#18181b] px-4 py-3 flex items-center justify-between border-b border-white/5 shrink-0">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1 bg-black/20 p-0.5 rounded border border-white/5">
                                            <button
                                                onClick={() => setPreviewMode('desktop')}
                                                className={cn("p-1 rounded hover:bg-white/10", previewMode === 'desktop' ? "text-white" : "text-zinc-500")}
                                            >
                                                <Monitor className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => setPreviewMode('mobile')}
                                                className={cn("p-1 rounded hover:bg-white/10", previewMode === 'mobile' ? "text-white" : "text-zinc-500")}
                                            >
                                                <Smartphone className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <Sliders className="w-3 h-3 text-zinc-400" />
                                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Live Preview</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PREVIEW CONTENT */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/50 p-4">
                                    <div className="flex border border-white/5 rounded-lg overflow-hidden h-[800px] shadow-2xl relative">
                                        <style>{`
                                            .preview-sandbox {
                                                --background: ${bgColor};
                                                --sidebar: ${sidebarColor};
                                                --primary: ${primaryColor};
                                                --radius: ${radius}px;
                                                --font-sans: '${fontFamily}', sans-serif;
                                                --fs-base: ${fsBase}px;
                                                --fs-title: ${fsTitle}px;
                                                --fs-card-title: ${fsCardTitle}px;
                                                --fs-menu: ${fsMenu}px;
                                                --fs-subtitle: ${fsSubtitle}px;
                                                --fs-stats: ${fsStats}px;
                                                --fs-small: ${fsSmall}px;
                                            }
                                        `}</style>

                                        {/* SIDEBAR MOCK */}
                                        <div className="w-64 bg-[var(--sidebar)] border-r border-white/5 p-4 flex flex-col gap-6 preview-sandbox">
                                            <div className="h-12 flex items-center px-2">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo" className="h-8 object-contain opacity-90" />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center">
                                                            <span className="font-bold text-white text-lg">U</span>
                                                        </div>
                                                        <span className="text-white font-bold text-lg tracking-tight">UNIAFY</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-[var(--sidebar)] text-zinc-400">
                                                    <div className="w-4 h-4 rounded-full bg-white/10" />
                                                    <span className="text-[var(--fs-menu)] font-medium">Dashboard</span>
                                                </div>
                                                <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-[var(--primary)] text-white shadow-[0_0_20px_-5px_var(--primary)]">
                                                    <div className="w-4 h-4 rounded-full bg-white/20" />
                                                    <span className="text-[var(--fs-menu)] font-medium">Analytics</span>
                                                </div>
                                                <div className="h-8 rounded-[var(--radius)] flex items-center px-3 gap-3 bg-[var(--sidebar)] text-zinc-400">
                                                    <div className="w-4 h-4 rounded-full bg-white/10" />
                                                    <span className="text-[var(--fs-menu)] font-medium">Clientes</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MAIN CONTENT MOCK */}
                                        <div className="flex-1 bg-[var(--background)] p-8 preview-sandbox">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h1 className="text-[var(--fs-title)] font-bold text-white mb-2">Dashboard Overview</h1>
                                                    <p className="text-[var(--fs-subtitle)] text-zinc-400">Bem-vindo ao novo painel de controle</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                                                    U
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6 mb-8">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-[var(--radius)]">
                                                        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                                                            <div className="w-5 h-5 bg-[var(--primary)] rounded text-primary" />
                                                        </div>
                                                        <h2 className="text-[var(--fs-stats)] font-bold text-white mb-2 leading-none">R$ 12.450</h2>
                                                        <p className="text-[var(--fs-small)] text-zinc-400 font-semibold">+15% vs mês anterior</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[var(--radius)]">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-[var(--fs-card-title)] font-bold text-white">Atividade Recente</h3>
                                                    <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white border-none rounded-[var(--radius)] text-[var(--fs-base)]">
                                                        Botão Principal
                                                    </Button>
                                                </div>
                                                <div className="space-y-4">
                                                    {[1, 2].map(i => (
                                                        <div key={i} className="flex items-center justify-between p-3 border-b border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                                                                <div className="h-3 w-32 bg-zinc-800 rounded" />
                                                            </div>
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
                </TabsContent>
            </Tabs>
        </div>
    );
}

