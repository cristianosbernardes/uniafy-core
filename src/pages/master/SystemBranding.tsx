import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Palette, LayoutDashboard, Save, Sliders, MousePointerClick, Globe, RotateCcw, LayoutTemplate, Smartphone, Monitor, Check, Users, Zap, LayoutGrid, Activity, Settings2, Image as ImageIcon, Type, Layout, Paintbrush, Fingerprint, ExternalLink, Moon, Sun } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// New Modular Components
import { BrandingLogos } from "./branding-sections/BrandingLogos";
import { BrandingColors } from "./branding-sections/BrandingColors";
import { BrandingUI } from "./branding-sections/BrandingUI";
import { BrandingLogin } from "./branding-sections/BrandingLogin";
import { BrandingPresets } from "./branding-sections/BrandingPresets";

export default function SystemBranding() {
    const { branding, refreshBranding } = useBranding();
    const [loading, setLoading] = useState(false);

    // Color State
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

    // Status Colors
    const [successColor, setSuccessColor] = useState("142 71% 45%");
    const [warningColor, setWarningColor] = useState("48 96% 53%");
    const [errorColor, setErrorColor] = useState("0 84% 60%");
    const [infoColor, setInfoColor] = useState("217 91% 60%");

    // Granular UI Colors
    const [textPrimaryColor, setTextPrimaryColor] = useState("0 0% 100%");
    const [textSecondaryColor, setTextSecondaryColor] = useState("240 5% 65%");
    const [borderStrongColor, setBorderStrongColor] = useState("240 5% 12%");
    const [borderSubtleColor, setBorderSubtleColor] = useState("0 0% 100% / 0.08");
    const [scrollThumbColor, setScrollThumbColor] = useState("240 5% 34%");

    // Profile Management
    const [selectedProfile, setSelectedProfile] = useState<string>("dark");
    const [profiles, setProfiles] = useState<Record<string, any>>({});

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
    const [activeSection, setActiveSection] = useState<'logos' | 'colors' | 'ui' | 'login' | 'presets'>('logos');

    // Background Type State
    const [loginBgType, setLoginBgType] = useState<'image' | 'color' | 'gradient'>('image');
    const [loginBgColor, setLoginBgColor] = useState('#000000');
    const [loginGradientStart, setLoginGradientStart] = useState('#1a1a1a');
    const [loginGradientEnd, setLoginGradientEnd] = useState('#000000');
    const [loginGradientDirection, setLoginGradientDirection] = useState('to bottom right');

    // UI/Typography State
    const [radius, setRadius] = useState(8); // Default 8px (0.5rem)
    const [fontFamily, setFontFamily] = useState("Inter");
    const [fsBase, setFsBase] = useState(14);
    const [fsTitle, setFsTitle] = useState(24); // Page Headers
    const [fsCardTitle, setFsCardTitle] = useState(18); // Card Headers
    const [fsMenu, setFsMenu] = useState(13); // Sidebar
    const [fsSubmenu, setFsSubmenu] = useState(14); // Context Sidebar
    const [fsSmall, setFsSmall] = useState(12);
    const [fsStats, setFsStats] = useState(32); // KPI Numbers
    const [fsSubtitle, setFsSubtitle] = useState(14); // Descriptions
    const [glassBlur, setGlassBlur] = useState(12);
    const [glassOpacity, setGlassOpacity] = useState(0.05);

    useEffect(() => {
        setIconsGlobalColor(primaryColor);
    }, [primaryColor]);

    useEffect(() => {
        if (branding) {
            setPrimaryColor(branding.colors?.primary || "24 100% 52%");
            setBgColor(branding.colors?.background || "240 10% 2%");
            setSidebarMenuColor(branding.colors?.sidebar_menu || branding.colors?.sidebar || "0 0% 2%");
            setSidebarSubmenuColor(branding.colors?.sidebar_submenu || branding.colors?.sidebar || "0 0% 5%");

            // Advanced colors
            if (branding.colors?.border) setBorderColor(branding.colors.border);
            if (branding.colors?.card) setCardColor(branding.colors.card);
            if (branding.colors?.hover) setHoverColor(branding.colors.hover);
            if (branding.colors?.header_bg) setHeaderBgColor(branding.colors.header_bg);
            if (branding.colors?.header_icons) setHeaderIconsColor(branding.colors.header_icons);
            if (branding.colors?.icons_global) setIconsGlobalColor(branding.colors.icons_global);

            // Status
            if (branding.colors?.success) setSuccessColor(branding.colors.success);
            if (branding.colors?.warning) setWarningColor(branding.colors.warning);
            if (branding.colors?.error) setErrorColor(branding.colors.error);
            if (branding.colors?.info) setInfoColor(branding.colors.info);

            if (branding.colors?.text_primary) setTextPrimaryColor(branding.colors.text_primary);
            if (branding.colors?.text_secondary) setTextSecondaryColor(branding.colors.text_secondary);
            if (branding.colors?.border_strong) setBorderStrongColor(branding.colors.border_strong);
            if (branding.colors?.border_subtle) setBorderSubtleColor(branding.colors.border_subtle);
            if (branding.colors?.scroll_thumb) setScrollThumbColor(branding.colors.scroll_thumb);

            if (branding.colors?.selected_profile) setSelectedProfile(branding.colors.selected_profile);
            if (branding.colors?.profiles) setProfiles(branding.colors.profiles);

            setLogoUrl(branding.logo_url || "");

            // Advanced
            setFaviconUrl(branding.favicon_url || '');
            setLoginBgUrl(branding.login?.bg_url || '');
            setLoginOverlayColor(branding.login?.overlay_color || '#000000');
            setLoginOverlayOpacity(branding.login?.overlay_opacity ?? 0.8);
            setLoginTitle(branding.login?.title || "");
            setLoginMessage(branding.login?.message || "");
            setLoginLogoUrl(branding.login?.logo_url || "");
            setLoginLayout(branding.login?.layout || 'center');

            if (branding.login) {
                setLoginBgType(branding.login.bg_type || 'image');
                setLoginBgColor(branding.login.bg_color || '#000000');
                setLoginGradientStart(branding.login.gradient_start || '#1a1a1a');
                setLoginGradientEnd(branding.login.gradient_end || '#000000');
                setLoginGradientDirection(branding.login.gradient_direction || 'to bottom right');
            }

            if (branding.ui) {
                // Determine Radius: if stored in rem (<= 2 usually), convert to px. If > 2, assume px (legacy or future proof)
                // Assuming always stored as REM for now based on context logic.
                const r = branding.ui.radius !== undefined ? branding.ui.radius : 0.5;
                setRadius(r * 16); // Convert REM to PX for UI

                if (branding.ui.fontFamily) setFontFamily(branding.ui.fontFamily);
                if (branding.ui.glass) {
                    setGlassBlur(branding.ui.glass.blur ?? 12);
                    setGlassOpacity(branding.ui.glass.opacity ?? 0.05);
                }
                if (branding.ui.fontSizes) {
                    setFsBase(branding.ui.fontSizes.base || 14);
                    setFsTitle(branding.ui.fontSizes.titles || 24);
                    setFsCardTitle(branding.ui.fontSizes.cardTitles || 18);
                    setFsMenu(branding.ui.fontSizes.menu || 13);
                    setFsSubmenu(branding.ui.fontSizes.submenu || 14);
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
                    sidebar: sidebarMenuColor,
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
                    info: infoColor,
                    selected_profile: selectedProfile,
                    profiles: {
                        ...profiles,
                        [selectedProfile]: {
                            primary: primaryColor,
                            background: bgColor,
                            sidebar_menu: sidebarMenuColor,
                            sidebar_submenu: sidebarSubmenuColor,
                            border: borderColor,
                            card: cardColor,
                            hover: hoverColor,
                            header_bg: headerBgColor,
                            header_icons: headerIconsColor,
                            icons_global: iconsGlobalColor,
                            success: successColor,
                            warning: warningColor,
                            error: errorColor,
                            info: infoColor,
                            text_primary: textPrimaryColor,
                            text_secondary: textSecondaryColor,
                            border_strong: borderStrongColor,
                            border_subtle: borderSubtleColor,
                            scroll_thumb: scrollThumbColor
                        }
                    }
                },
                logo_url: logoUrl,
                favicon_url: faviconUrl,
                login: {
                    bg_url: loginBgUrl,
                    overlay_color: loginOverlayColor,
                    overlay_opacity: loginOverlayOpacity,
                    title: loginTitle,
                    message: loginMessage,
                    logo_url: loginLogoUrl,
                    layout: loginLayout,
                    bg_type: loginBgType,
                    bg_color: loginBgColor,
                    gradient_start: loginGradientStart,
                    gradient_end: loginGradientEnd,
                    gradient_direction: loginGradientDirection,
                },
                ui: {
                    radius: radius / 16,
                    fontFamily,
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

            const { data: currentConfig, error: fetchError } = await supabase
                .from('master_config')
                .select('id')
                .limit(1)
                .single();

            if (fetchError || !currentConfig) throw fetchError || new Error('Config não encontrada');

            const { error: updateError } = await supabase
                .from('master_config')
                .update({ branding: updatedBranding })
                .eq('id', currentConfig.id);

            if (updateError) throw updateError;

            await refreshBranding();
            toast.success('Identidade Visual atualizada com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar branding:', error);
            toast.error(error.message || 'Erro ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Tem certeza que deseja restaurar os padrões visuais do sistema?')) return;

        setLoading(true);
        try {
            const defaultBranding = {
                colors: {
                    primary: "24 100% 52%",
                    background: "240 10% 2%",
                    sidebar: "0 0% 2%",
                    sidebar_menu: "0 0% 2%",
                    sidebar_submenu: "0 0% 5%",
                    sidebar_active: "24 100% 52%",
                    border: "0 0% 100% / 0.1",
                    card: "0 0% 100% / 0.05",
                    hover: "24 100% 52% / 0.1"
                },
                logo_url: "",
                favicon_url: "",
                login: {
                    bg_url: "",
                    overlay_color: "#000000",
                    overlay_opacity: 0.8,
                    title: "",
                    message: "",
                    logo_url: "",
                    layout: "center" as const,
                    bg_type: "image",
                    bg_color: "#000000",
                    gradient_start: "#1a1a1a",
                    gradient_end: "#000000",
                    gradient_direction: "to bottom right"
                },
                ui: { radius: 0.5, fontFamily: "Inter", fontSizes: { base: 14, titles: 24, cardTitles: 18, menu: 13, submenu: 14, small: 12, stats: 32, subtitles: 14 } }
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

    const applyPreset = (preset: string) => {
        // 1. Save current colors to the previous profile
        setProfiles(prev => ({
            ...prev,
            [selectedProfile]: {
                primary: primaryColor,
                background: bgColor,
                sidebar_menu: sidebarMenuColor,
                sidebar_submenu: sidebarSubmenuColor,
                border: borderColor,
                card: cardColor,
                hover: hoverColor,
                header_bg: headerBgColor,
                header_icons: headerIconsColor,
                icons_global: iconsGlobalColor,
                text_primary: textPrimaryColor,
                text_secondary: textSecondaryColor,
                border_strong: borderStrongColor,
                border_subtle: borderSubtleColor,
                scroll_thumb: scrollThumbColor
            }
        }));

        // 2. Set new profile
        setSelectedProfile(preset);

        // 3. Load from existing profile if available
        if (profiles[preset]) {
            const p = profiles[preset];
            if (p.background) setBgColor(p.background);
            if (p.sidebar_menu) setSidebarMenuColor(p.sidebar_menu);
            if (p.sidebar_submenu) setSidebarSubmenuColor(p.sidebar_submenu);
            if (p.border) setBorderColor(p.border);
            if (p.card) setCardColor(p.card);
            if (p.hover) setHoverColor(p.hover);
            if (p.header_bg) setHeaderBgColor(p.header_bg);
            if (p.header_icons) setHeaderIconsColor(p.header_icons);
            setIconsGlobalColor(primaryColor);
            if (p.text_primary) setTextPrimaryColor(p.text_primary);
            if (p.text_secondary) setTextSecondaryColor(p.text_secondary);
            if (p.border_strong) setBorderStrongColor(p.border_strong);
            if (p.border_subtle) setBorderSubtleColor(p.border_subtle);
            if (p.scroll_thumb) setScrollThumbColor(p.scroll_thumb);
            toast.success(`Carregado perfil ${preset === 'dark' ? 'Dark Industrial' : 'Clean White'}!`);
            return;
        }

        // 4. Default presets logic
        if (preset === 'dark') {
            setBgColor("240 10% 2%");
            setSidebarMenuColor("0 0% 2%");
            setSidebarSubmenuColor("0 0% 5%");
            setBorderColor("0 0% 100% / 0.1");
            setBorderStrongColor("240 5% 12%");
            setBorderSubtleColor("0 0% 100% / 0.08");
            setCardColor("0 0% 100% / 0.05");
            setHeaderBgColor("240 10% 2%");
            setHeaderIconsColor("0 0% 100%");
            setIconsGlobalColor(primaryColor);
            setTextPrimaryColor("0 0% 100%");
            setTextSecondaryColor("240 5% 65%");
            setScrollThumbColor("240 5% 34%");
            setHoverColor("0 0% 100% / 0.05");
        } else if (preset === 'white') {
            setBgColor("0 0% 100%");
            setSidebarMenuColor("0 0% 98%");
            setSidebarSubmenuColor("0 0% 95%");
            setBorderColor("0 0% 0% / 0.1");
            setBorderStrongColor("0 0% 0% / 0.15");
            setBorderSubtleColor("0 0% 0% / 0.05");
            setCardColor("0 0% 0% / 0.03");
            setHeaderBgColor("0 0% 100%");
            setHeaderIconsColor("0 0% 10%");
            setIconsGlobalColor(primaryColor);
            setTextPrimaryColor("0 0% 10%");
            setTextSecondaryColor("0 0% 45%");
            setScrollThumbColor("0 0% 85%");
            setHoverColor("0 0% 0% / 0.05");
        }
        toast.success(`Tema ${preset === 'dark' ? 'Dark Industrial' : 'Clean White'} aplicado!`);
    };


    return (
        <div className="flex flex-col h-[calc(100vh-80px)] -mt-4 overflow-hidden">
            {/* TOP BAR / NAVIGATION INTEGRATED */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505] shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                            Branding Center
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">ClickUp Standard Implementation</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-zinc-500 hover:text-white text-xs font-bold tracking-widest gap-2"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Resetar
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="h-9 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-widest gap-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* SETTINGS SIDEBAR */}
                <div className="w-64 bg-[#09090b] border-r border-white/5 flex flex-col pt-6 shrink-0 h-full">
                    <div className="px-6 mb-6">
                        <h3 className="text-[10px] font-black text-zinc-600 tracking-[0.2em]">Configurações</h3>
                    </div>

                    <div className="flex-1 space-y-1">
                        {[
                            { id: 'logos', label: 'Identidade & Logos', icon: ImageIcon },
                            { id: 'colors', label: 'Cores do Sistema', icon: Paintbrush },
                            { id: 'ui', label: 'Interface & Shape', icon: Layout },
                            { id: 'login', label: 'Tela de Login', icon: Fingerprint },
                            { id: 'presets', label: 'Temas & Presets', icon: Palette },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-6 py-3 transition-all relative group",
                                    activeSection === item.id
                                        ? "text-primary bg-primary/5 border-r-2 border-primary"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-primary" : "text-primary/60 group-hover:text-primary")} />
                                <span className="text-xs font-medium tracking-wider">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/5 space-y-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Alterações no preview são em tempo real. Pressione <b>Salvar</b> para aplicar globalmente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT SPLIT */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT: CONTROLS (SCROLLABLE) */}
                    <div className="w-[450px] border-r border-white/5 overflow-y-auto custom-scrollbar bg-[#050505] shrink-0 p-8 space-y-8">

                        {/* SECTION CONTENT MAPPER */}
                        {activeSection === 'logos' && (
                            <BrandingLogos
                                faviconUrl={faviconUrl}
                                setFaviconUrl={setFaviconUrl}
                                logoUrl={logoUrl}
                                setLogoUrl={setLogoUrl}
                                loginLogoUrl={loginLogoUrl}
                                setLoginLogoUrl={setLoginLogoUrl}
                            />
                        )}

                        {activeSection === 'colors' && (
                            <BrandingColors
                                primaryColor={primaryColor}
                                setPrimaryColor={setPrimaryColor}
                            />
                        )}

                        {activeSection === 'ui' && (
                            <BrandingUI
                                fontFamily={fontFamily}
                                setFontFamily={setFontFamily}
                                fsTitle={fsTitle}
                                setFsTitle={setFsTitle}
                                fsStats={fsStats}
                                setFsStats={setFsStats}
                                fsCardTitle={fsCardTitle}
                                setFsCardTitle={setFsCardTitle}
                                fsMenu={fsMenu}
                                setFsMenu={setFsMenu}
                                fsSubmenu={fsSubmenu}
                                setFsSubmenu={setFsSubmenu}
                                fsBase={fsBase}
                                setFsBase={setFsBase}
                                radius={radius}
                                setRadius={setRadius}
                                glassBlur={glassBlur}
                                setGlassBlur={setGlassBlur}
                                glassOpacity={glassOpacity}
                                setGlassOpacity={setGlassOpacity}
                            />
                        )}

                        {activeSection === 'login' && (
                            <BrandingLogin
                                loginLayout={loginLayout}
                                setLoginLayout={setLoginLayout}
                                loginTitle={loginTitle}
                                setLoginTitle={setLoginTitle}
                                loginMessage={loginMessage}
                                setLoginMessage={setLoginMessage}
                                loginBgUrl={loginBgUrl}
                                setLoginBgUrl={setLoginBgUrl}
                                loginOverlayOpacity={loginOverlayOpacity}
                                setLoginOverlayOpacity={setLoginOverlayOpacity}
                                loginOverlayColor={loginOverlayColor}
                            />
                        )}

                        {activeSection === 'presets' && (
                            <BrandingPresets
                                applyPreset={applyPreset}
                                selectedProfile={selectedProfile}
                                primaryColor={primaryColor}
                            />
                        )}
                    </div>

                    {/* RIGHT: PREVIEW (FLEX-1) */}
                    <div className="flex-1 bg-[#09090b] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* DECORATIVE GRID */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                        <div className="w-full max-w-[900px] h-full flex flex-col space-y-4">
                            <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-md px-6 py-3 rounded-xl border border-white/5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Simulation</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                                    <button onClick={() => setPreviewMode('desktop')} className={cn("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2", previewMode === 'desktop' ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white")}><Monitor className="w-3.5 h-3.5" /> Desktop</button>
                                    <button onClick={() => setPreviewMode('mobile')} className={cn("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2", previewMode === 'mobile' ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white")}><Smartphone className="w-3.5 h-3.5" /> Mobile</button>
                                </div>
                            </div>

                            <div className={cn(
                                "flex-1 border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-500 mx-auto bg-black relative flex flex-col",
                                previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full"
                            )}
                                style={{
                                    "--primary": primaryColor,
                                    "--background": bgColor,
                                    "--sidebar": sidebarMenuColor,
                                    "--sidebar-submenu": sidebarSubmenuColor,
                                    "--border": borderColor,
                                    "--card": cardColor,
                                    "--hover": hoverColor,
                                    "--header": headerBgColor,
                                    "--header-icons": headerIconsColor,
                                    "--text-primary": textPrimaryColor,
                                    "--text-secondary": textSecondaryColor,
                                    "--border-strong": borderStrongColor,
                                    "--border-subtle": borderSubtleColor,
                                    "--scroll-thumb": scrollThumbColor,
                                    "--radius": `${radius}px`,
                                    "--font-family": fontFamily,
                                } as any}
                            >
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

                                {activeSection === 'login' ? (
                                    <div className="flex-1 relative flex items-center justify-center p-12 bg-zinc-900/50 overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                                            style={{
                                                backgroundImage: loginBgType === 'image' && loginBgUrl ? `url(${loginBgUrl})` :
                                                    loginBgType === 'gradient' ? `linear-gradient(${loginGradientDirection}, ${loginGradientStart}, ${loginGradientEnd})` : undefined,
                                                backgroundColor: loginBgType === 'color' ? loginBgColor : undefined,
                                                width: loginLayout === 'split' && previewMode === 'desktop' ? '50%' : '100%'
                                            }}
                                        >
                                            {loginBgType === 'image' && (
                                                <div className="absolute inset-0" style={{ backgroundColor: loginOverlayColor, opacity: loginOverlayOpacity }}></div>
                                            )}
                                        </div>

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
                                ) : activeSection === 'logos' ? (
                                    <div className="flex-1 bg-[hsl(var(--background))] flex flex-col animate-in fade-in duration-500">
                                        <div className="h-16 px-8 border-b border-[hsl(var(--border))] bg-[hsl(var(--header))] flex items-center justify-between shrink-0">
                                            <div className="flex items-center gap-6">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
                                                ) : (
                                                    <div className="h-8 w-24 bg-white/5 rounded flex items-center justify-center border border-white/10 text-[8px] uppercase font-black text-zinc-500">Logo Header</div>
                                                )}
                                                <div className="h-4 w-px bg-white/10 mx-2" />
                                                <div className="flex gap-4">
                                                    <div className="h-2 w-12 bg-white/5 rounded" />
                                                    <div className="h-2 w-16 bg-white/5 rounded" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex overflow-hidden">
                                            <div className="w-64 bg-[hsl(var(--sidebar))] border-r border border-[var(--border-subtle)] p-6 flex flex-col gap-8 shrink-0">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Main Application</p>
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-10 rounded-[var(--radius)] bg-[var(--card)] flex items-center px-4 gap-3 opacity-40">
                                                            <div className="w-4 h-4 rounded bg-[var(--border-subtle)]" />
                                                            <div className="w-20 h-2 bg-[var(--border-subtle)] rounded" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-1 p-12 flex items-center justify-center">
                                                <div className="max-w-md w-full space-y-12 text-center">
                                                    <div className="space-y-4">
                                                        <h3 className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.3em]">Brand Identity Preview</h3>
                                                        <div className="p-12 rounded-3xl bg-[var(--card)] border border-[var(--border-subtle)] shadow-2xl inline-block relative overflow-hidden group">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            {loginLogoUrl || logoUrl ? (
                                                                <img src={loginLogoUrl || logoUrl} alt="Main Logo" className="h-24 object-contain relative z-10 transition-transform group-hover:scale-110" />
                                                            ) : (
                                                                <div className="h-24 w-48 bg-[var(--card)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-center relative z-10">
                                                                    <ImageIcon className="w-12 h-12 text-[var(--text-secondary)]" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
                                                        <div className="space-y-3">
                                                            <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Favicon</p>
                                                            <div className="w-12 h-12 bg-[hsl(var(--background))] rounded-lg border border-[var(--border-subtle)] flex items-center justify-center mx-auto shadow-xl">
                                                                {faviconUrl ? <img src={faviconUrl} className="w-8 h-8 object-contain" /> : <Globe className="w-6 h-6 text-[var(--text-secondary)]" />}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Primary Mark</p>
                                                            <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center mx-auto shadow-xl shadow-[var(--primary)]/30">
                                                                <div className="w-6 h-6 bg-white/20 rounded-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeSection === 'ui' ? (
                                    <div className="flex-1 bg-[hsl(var(--background))] p-8 overflow-y-auto custom-scrollbar space-y-8 animate-in fade-in duration-500">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight" style={{ fontSize: `${fsTitle}px`, fontFamily: fontFamily }}>Interface & Library</h2>
                                            <div className="h-1 w-12 bg-[var(--primary)] rounded-full" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] rounded-[var(--radius)] space-y-4">
                                                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase">Buttons & States</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    <button className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-[var(--radius)] shadow-lg shadow-[var(--primary)]/20">Primary</button>
                                                    <button className="px-4 py-2 bg-[var(--hover)] text-[var(--text-primary)] text-xs font-bold rounded-[var(--radius)] border border-[var(--border-subtle)] transition-colors">Secondary</button>
                                                    <button className="px-4 py-2 bg-transparent text-[var(--primary)] text-xs font-bold rounded-[var(--radius)] border border-[var(--primary)]/30">Outline</button>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] rounded-[var(--radius)] space-y-4">
                                                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase">Form Elements</h3>
                                                <div className="space-y-3">
                                                    <div className="h-9 bg-[hsl(var(--background))] border border-[var(--border-subtle)] rounded-[var(--radius)] w-full" />
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-sm border border-[var(--primary)] bg-[var(--primary)]/10 flex items-center justify-center"><Check className="w-3 h-3 text-[var(--primary)]" /></div>
                                                        <span className="text-[10px] text-[var(--text-secondary)]">Checkbox Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-[var(--card)] border border-[var(--border-subtle)] rounded-[var(--radius)] relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-50" />
                                            <div className="relative z-10 space-y-4">
                                                <h3 className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em]">Glassmorphism Effect</h3>
                                                <div
                                                    className="p-6 rounded-2xl border border-[var(--border-subtle)] shadow-2xl"
                                                    style={{
                                                        backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
                                                        backdropFilter: `blur(${glassBlur}px)`
                                                    }}
                                                >
                                                    <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">Este elemento demonstra o efeito de desfoque e opacidade configurado em tempo real.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex overflow-hidden animate-in fade-in duration-500">
                                        {/* DASHBOARD MOCKUP */}
                                        <div className="w-48 bg-[hsl(var(--sidebar))] border-r border-[var(--border-subtle)] p-4 flex flex-col gap-6 shrink-0">
                                            <div className="h-6 w-24 bg-[var(--border-subtle)] rounded mb-4" />
                                            <div className="space-y-3">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={cn("h-8 rounded-[var(--radius)] flex items-center px-3 gap-2", i === 1 ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text-secondary)]")}>
                                                        <div className="w-3.5 h-3.5 rounded-sm bg-current opacity-20" />
                                                        <div className="w-16 h-2 bg-current opacity-10 rounded-full" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-[hsl(var(--background))] p-8 space-y-8 overflow-y-auto custom-scrollbar">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight uppercase" style={{ fontSize: `${fsTitle}px`, fontFamily: fontFamily }}>Dashboard Overview</h2>
                                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Growth Engine Active</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border-subtle)]" />
                                                    <div className="h-8 px-4 bg-[var(--primary)] rounded-[var(--radius)] flex items-center"><span className="text-[10px] font-bold text-white uppercase tracking-tighter">Actions</span></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-6">
                                                {[
                                                    { label: 'Total MRR', val: '$42,500', color: successColor },
                                                    { label: 'Active Trials', val: '128', color: primaryColor },
                                                    { label: 'Churn Rate', val: '2.4%', color: errorColor },
                                                ].map((s, idx) => (
                                                    <div key={idx} className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] rounded-[var(--radius)] space-y-3 relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all">
                                                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</p>
                                                        <h4 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontSize: `${fsStats}px` }}>{s.val}</h4>
                                                        <div className="h-1 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden mt-2">
                                                            <div className="h-full bg-[var(--primary)] w-2/3" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] rounded-[var(--radius)] space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xs font-black text-[var(--text-primary)] uppercase">Performance Evolution</h3>
                                                    <div className="flex gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)] opacity-20" />
                                                    </div>
                                                </div>
                                                <div className="h-48 w-full relative flex items-end gap-2">
                                                    {[40, 60, 45, 80, 55, 70, 90, 65, 85, 100].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-gradient-to-t from-[var(--primary)]/5 to-[var(--primary)]/40 rounded-t-sm" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
