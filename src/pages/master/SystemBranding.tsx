import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Palette, LayoutDashboard, Save, Sliders, MousePointerClick, Globe, RotateCcw, LayoutTemplate, Smartphone, Monitor, Check, Users, Zap, LayoutGrid, Activity, Settings2, Image as ImageIcon, Type, Layout, Paintbrush, Fingerprint, ExternalLink, Moon, Sun, Search, PanelLeft, Loader2, Layers, Ghost, Mail } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, AlertTriangle } from "lucide-react";

// New Modular Components
import { BrandingLogos } from "./branding-sections/BrandingLogos";
import { BrandingColors } from "./branding-sections/BrandingColors";
import { BrandingUI } from "./branding-sections/BrandingUI";
import { BrandingLogin } from "./branding-sections/BrandingLogin";
import { BrandingPresets } from "./branding-sections/BrandingPresets";
import { BrandingTypography } from "./branding-sections/BrandingTypography";
import { BrandingLoader } from "./branding-sections/BrandingLoader";
import { BrandingEffects } from "./branding-sections/BrandingEffects";
import { BrandingAppIcons } from "./branding-sections/BrandingAppIcons";
import { BrandingSystemPages } from "./branding-sections/BrandingSystemPages";
import { BrandingEmail } from "./branding-sections/BrandingEmail";
import { BrandingSounds } from "./branding-sections/BrandingSounds";
import { BrandingSEO } from "./branding-sections/BrandingSEO";
import { BrandingFooter } from "./branding-sections/BrandingFooter";
// Icons already imported or added here if missing
// Volume2, Globe, Copyright are needed.
// Checking line 7 for duplicates.
// Line 7 has: ..., Globe, ... 
// I need Volume2 and Copyright.
import { Volume2, Copyright } from "lucide-react";

const DEFAULT_BRANDING = {
    colors: {
        primary: "24 100% 52%",
        background: "240 10% 2%",
        sidebar: "0 0% 2%",
        sidebar_menu: "0 0% 2%",
        sidebar_submenu: "0 0% 5%",
        sidebar_active: "24 100% 52%",
        border: "0 0% 100% / 0.1",
        card: "0 0% 100% / 0.05",
        hover: "24 100% 52% / 0.1",
        header_bg: "240 10% 2%",
        header_icons: "0 0% 100%",
        icons_global: "24 100% 52%",
        success: "142 71% 45%",
        warning: "48 96% 53%",
        error: "0 84% 60%",
        info: "217 91% 60%",
        text_primary: "0 0% 100%",
        text_secondary: "240 5% 65%",
        border_strong: "240 5% 12%",
        border_subtle: "0 0% 100% / 0.08",
        scroll_thumb: "240 5% 34%"
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
        bg_type: "image" as const,
        bg_color: "#000000",
        gradient_start: "#1a1a1a",
        gradient_end: "#000000",
        gradient_direction: "to bottom right"
    },
    ui: {
        radius: 0.5,
        fontFamily: "Inter",
        fontHeadings: "",
        effects: { shadowStyle: 'soft' as const },
        loader: { type: 'spinner' as const, customUrl: '', color: '', bgColor: '' },
        glass: { blur: 12, opacity: 0.05 },
        fontSizes: { base: 14, titles: 24, cardTitles: 18, menu: 13, submenu: 14, small: 12, stats: 32, subtitles: 14 }
    },
    pwa: { appleTouchIcon: "", androidIcon192: "", androidIcon512: "" },
    systemPages: {
        maintenance: { isActive: false, message: "", estimatedReturn: "" },
        notFound: { imageUrl: "", title: "", description: "", backButtonText: "" }
    },
    email: { headerColor: "#FF6600", ctaColor: "#FF6600", footerText: "" },
    sounds: { enabled: false, volume: 0.5 },
    seo: { titleTemplate: "%s | Uniafy", description: "", ogImage: "" },
    footer: { text: "© 2026 Uniafy Platform. Todos os direitos reservados.", showLinks: true, links: [] }
};

export default function SystemBranding() {
    const { branding, refreshBranding } = useBranding();
    const [loading, setLoading] = useState(false);

    // Color State
    const [primaryColor, setPrimaryColor] = useState("#FF6600"); // Orange (Brand)
    const [bgColor, setBgColor] = useState("#09090b"); // Dark Background
    const [sidebarMenuColor, setSidebarMenuColor] = useState("#020202"); // Sidebar Dark
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
    const [activeSection, setActiveSection] = useState<'logos' | 'colors' | 'ui' | 'typography' | 'loader' | 'effects' | 'pwa' | 'pages' | 'email' | 'login' | 'presets' | 'sounds' | 'seo' | 'footer'>('logos');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    // EXPANSION STATES
    // Typography
    const [fontHeadings, setFontHeadings] = useState("");

    // Effects
    const [shadowStyle, setShadowStyle] = useState<'flat' | 'soft' | 'hard'>('soft');

    // Loader
    const [loaderType, setLoaderType] = useState<'spinner' | 'pulse' | 'bar' | 'custom'>('spinner');
    const [loaderCustomUrl, setLoaderCustomUrl] = useState("");

    // PWA
    const [appleTouchIcon, setAppleTouchIcon] = useState("");
    const [androidIcon192, setAndroidIcon192] = useState("");
    const [androidIcon512, setAndroidIcon512] = useState("");

    // System Pages
    const [maintenanceIsActive, setMaintenanceIsActive] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState("");
    const [maintenanceReturn, setMaintenanceReturn] = useState("");
    const [notFoundImageUrl, setNotFoundImageUrl] = useState("");
    const [notFoundTitle, setNotFoundTitle] = useState("");

    // Email
    const [emailHeaderColor, setEmailHeaderColor] = useState("#FF6600");
    const [emailCtaColor, setEmailCtaColor] = useState("#FF6600");
    const [emailFooterText, setEmailFooterText] = useState("");

    // Sounds
    const [soundsEnabled, setSoundsEnabled] = useState(false);
    const [soundsVolume, setSoundsVolume] = useState(0.5);

    // SEO
    const [seoTitle, setSeoTitle] = useState("%s | Uniafy");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoOgImage, setSeoOgImage] = useState("");

    // Footer
    const [footerText, setFooterText] = useState("© 2026 Uniafy Platform. Todos os direitos reservados.");
    const [footerShowLinks, setFooterShowLinks] = useState(true);

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
                if (branding.ui.fontHeadings) setFontHeadings(branding.ui.fontHeadings);

                if (branding.ui.glass) {
                    setGlassBlur(branding.ui.glass.blur ?? 12);
                    setGlassOpacity(branding.ui.glass.opacity ?? 0.05);
                }

                if (branding.ui.effects?.shadowStyle) setShadowStyle(branding.ui.effects.shadowStyle);

                if (branding.ui.loader) {
                    setLoaderType(branding.ui.loader.type);
                    if (branding.ui.loader.customUrl) setLoaderCustomUrl(branding.ui.loader.customUrl);
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

            if (branding.pwa) {
                if (branding.pwa.appleTouchIcon) setAppleTouchIcon(branding.pwa.appleTouchIcon);
                if (branding.pwa.androidIcon192) setAndroidIcon192(branding.pwa.androidIcon192);
                if (branding.pwa.androidIcon512) setAndroidIcon512(branding.pwa.androidIcon512);
            }

            if (branding.systemPages) {
                if (branding.systemPages.maintenance) {
                    setMaintenanceIsActive(branding.systemPages.maintenance.isActive);
                    setMaintenanceMessage(branding.systemPages.maintenance.message || "");
                    setMaintenanceReturn(branding.systemPages.maintenance.estimatedReturn || "");
                }
                if (branding.systemPages.notFound) {
                    setNotFoundImageUrl(branding.systemPages.notFound.imageUrl || "");
                    setNotFoundTitle(branding.systemPages.notFound.title || "");
                }
            }

            if (branding.email) {
                if (branding.email.headerColor) setEmailHeaderColor(branding.email.headerColor);
                if (branding.email.ctaColor) setEmailCtaColor(branding.email.ctaColor);
                if (branding.email.footerText) setEmailFooterText(branding.email.footerText);
            }

            if (branding.sounds) {
                setSoundsEnabled(branding.sounds.enabled ?? false);
                setSoundsVolume(branding.sounds.volume ?? 0.5);
            }

            if (branding.seo) {
                setSeoTitle(branding.seo.titleTemplate || "%s | Uniafy");
                setSeoDescription(branding.seo.description || "");
                setSeoOgImage(branding.seo.ogImage || "");
            }

            if (branding.footer) {
                setFooterText(branding.footer.text || "© 2026 Uniafy Platform. Todos os direitos reservados.");
                setFooterShowLinks(branding.footer.showLinks ?? true);
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
                    fontHeadings: fontHeadings === 'default' ? '' : fontHeadings,
                    effects: {
                        shadowStyle
                    },
                    loader: {
                        type: loaderType,
                        customUrl: loaderCustomUrl,
                        color: primaryColor,
                        bgColor: bgColor
                    },
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
                },
                pwa: {
                    appleTouchIcon,
                    androidIcon192,
                    androidIcon512
                },
                systemPages: {
                    maintenance: {
                        isActive: maintenanceIsActive,
                        message: maintenanceMessage,
                        estimatedReturn: maintenanceReturn
                    },
                    notFound: {
                        imageUrl: notFoundImageUrl,
                        title: notFoundTitle,
                        description: "",
                        backButtonText: ""
                    }
                },
                email: {
                    headerColor: emailHeaderColor,
                    footerText: emailFooterText,
                    ctaColor: emailCtaColor
                },
                sounds: {
                    enabled: soundsEnabled,
                    volume: soundsVolume
                },
                seo: {
                    titleTemplate: seoTitle,
                    description: seoDescription,
                    ogImage: seoOgImage
                },
                footer: {
                    text: footerText,
                    showLinks: footerShowLinks,
                    links: []
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



    const handleReset = async (scope: 'global' | 'section' = 'global') => {
        const actionLabel = scope === 'global' ? 'RESTAURAR PADRÕES DE FÁBRICA' : `RESTAURAR PADRÕES DE ${activeSection.toUpperCase()}`;
        if (!confirm(`ATENÇÃO: Você deseja ${actionLabel}?\n\nEssa ação não pode ser desfeita.`)) return;

        setLoading(true);
        try {
            let configToSave = { ...branding }; // Start with current branding

            if (scope === 'global') {
                configToSave = { ...DEFAULT_BRANDING };
            } else {
                // Section-based reset logic
                switch (activeSection) {
                    case 'logos':
                        configToSave.logo_url = DEFAULT_BRANDING.logo_url;
                        configToSave.favicon_url = DEFAULT_BRANDING.favicon_url;
                        if (configToSave.login) configToSave.login.logo_url = DEFAULT_BRANDING.login.logo_url;
                        break;
                    case 'colors':
                        configToSave.colors = { ...DEFAULT_BRANDING.colors };
                        break;
                    case 'ui':
                        if (configToSave.ui) {
                            configToSave.ui.radius = DEFAULT_BRANDING.ui.radius;
                            configToSave.ui.glass = { ...DEFAULT_BRANDING.ui.glass };
                            configToSave.ui.fontSizes = { ...DEFAULT_BRANDING.ui.fontSizes };
                        }
                        break;
                    case 'typography':
                        if (configToSave.ui) {
                            configToSave.ui.fontFamily = DEFAULT_BRANDING.ui.fontFamily;
                            configToSave.ui.fontHeadings = DEFAULT_BRANDING.ui.fontHeadings;
                        }
                        break;
                    case 'loader':
                        if (configToSave.ui) configToSave.ui.loader = { ...DEFAULT_BRANDING.ui.loader };
                        break;
                    case 'effects':
                        if (configToSave.ui) configToSave.ui.effects = { ...DEFAULT_BRANDING.ui.effects };
                        break;
                    case 'login':
                        configToSave.login = { ...DEFAULT_BRANDING.login };
                        break;
                    case 'pwa':
                        configToSave.pwa = { ...DEFAULT_BRANDING.pwa };
                        break;
                    case 'pages':
                        configToSave.systemPages = { ...DEFAULT_BRANDING.systemPages };
                        break;
                    case 'email':
                        configToSave.email = { ...DEFAULT_BRANDING.email };
                        break;
                    case 'sounds':
                        configToSave.sounds = { ...DEFAULT_BRANDING.sounds };
                        break;
                    case 'seo':
                        configToSave.seo = { ...DEFAULT_BRANDING.seo };
                        break;
                    case 'footer':
                        configToSave.footer = { ...DEFAULT_BRANDING.footer };
                        break;
                    case 'presets':
                        toast.info("Para resetar presets, aplique um tema padrão manualmente.");
                        setLoading(false);
                        return; // No specific state to reset for presets logic as it applies colors
                }
            }

            const { error } = await supabase
                .from('master_config')
                .update({ branding: configToSave })
                .eq('id', 1);

            if (error) throw error;
            await refreshBranding();
            toast.success(scope === 'global' ? 'Sistema restaurado com sucesso!' : `Seção ${activeSection} restaurada!`);
        } catch (error: any) {
            toast.error('Erro ao restaurar padrões.');
            console.error(error);
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
        <div className="flex flex-col h-[calc(100vh-32px)] space-y-4">
            <PageHeader
                title="BRANDING"
                titleAccent="CENTER"
                subtitle="Master Suite • Personalização e Identidade Visual"
                action={
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Resetar
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-[#09090b] border-white/10 text-zinc-300">
                            <DropdownMenuLabel>Opções de Restauração</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => handleReset('section')} className="gap-2 cursor-pointer focus:bg-primary/20 focus:text-primary">
                                <RotateCcw className="w-4 h-4" />
                                <span>Restaurar {activeSection.toUpperCase()}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => handleReset('global')} className="gap-2 text-red-400 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-400">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Restaurar Sistema (ALL)</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
                actions={[
                    {
                        label: 'Salvar Alterações',
                        icon: Save,
                        variant: 'primary',
                        onClick: handleSave,
                        isLoading: loading,
                    }
                ]}
            />

            <div className="flex flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#09090b] shadow-2xl">
                {/* SETTINGS SIDEBAR */}
                <div className={cn(
                    "bg-[#09090b] border-r border-white/5 flex flex-col pt-6 shrink-0 h-full transition-all duration-300",
                    isSidebarCollapsed ? "w-20 items-center" : "w-64"
                )}>
                    <div className={cn("mb-6 flex items-center justify-between", isSidebarCollapsed ? "px-0 justify-center" : "px-6")}>
                        {!isSidebarCollapsed && (
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-normal">Configurações</h3>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className={cn("h-6 w-6 text-zinc-500 hover:text-white", isSidebarCollapsed && "h-8 w-8")}
                        >
                            <PanelLeft className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-1 w-full overflow-y-auto custom-scrollbar pr-1">
                        {[
                            { id: 'logos', label: 'Identidade & Logos', icon: ImageIcon },
                            { id: 'colors', label: 'Cores do Sistema', icon: Paintbrush },
                            { id: 'typography', label: 'Tipografia', icon: Type },
                            { id: 'ui', label: 'Interface & Shape', icon: Layout },
                            { id: 'effects', label: 'Efeitos & Sombras', icon: Layers },
                            { id: 'loader', label: 'Carregamento', icon: Loader2 },
                            { id: 'login', label: 'Tela de Login', icon: Fingerprint },
                            { id: 'pwa', label: 'App / PWA', icon: Smartphone },
                            { id: 'pages', label: 'Páginas Sistema', icon: Ghost },
                            { id: 'sounds', label: 'Sons & Feedback', icon: Volume2 },
                            { id: 'seo', label: 'SEO & Social', icon: Globe },
                            { id: 'footer', label: 'Rodapé & Legal', icon: Copyright },
                            { id: 'email', label: 'E-mails', icon: Mail },
                            { id: 'presets', label: 'Temas & Presets', icon: Palette },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                className={cn(
                                    "flex items-center transition-all relative group",
                                    isSidebarCollapsed
                                        ? "w-10 h-10 mx-auto justify-center rounded-lg"
                                        : "w-full gap-3 px-6 py-3",
                                    activeSection === item.id
                                        ? isSidebarCollapsed
                                            ? "bg-primary/10 text-primary"
                                            : "text-primary bg-primary/5 border-l-2 border-primary"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                )}
                                title={isSidebarCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-primary" : "text-primary/60 group-hover:text-primary")} />
                                {!isSidebarCollapsed && <span className="text-xs font-medium tracking-wider">{item.label}</span>}
                            </button>
                        ))}
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="p-4 border-t border-white/5">
                            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                                Alterações no preview são em tempo real. <br /> Pressione <span className="text-zinc-300 font-bold">Salvar</span> para aplicar.
                            </p>
                        </div>
                    )}
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
                                bgColor={bgColor}
                                setBgColor={setBgColor}
                                sidebarMenuColor={sidebarMenuColor}
                                setSidebarMenuColor={setSidebarMenuColor}
                                sidebarSubmenuColor={sidebarSubmenuColor}
                                setSidebarSubmenuColor={setSidebarSubmenuColor}
                                borderColor={borderColor}
                                setBorderColor={setBorderColor}
                                cardColor={cardColor}
                                setCardColor={setCardColor}
                                hoverColor={hoverColor}
                                setHoverColor={setHoverColor}
                                textPrimaryColor={textPrimaryColor}
                                setTextPrimaryColor={setTextPrimaryColor}
                                textSecondaryColor={textSecondaryColor}
                                setTextSecondaryColor={setTextSecondaryColor}
                                headerBgColor={headerBgColor}
                                setHeaderBgColor={setHeaderBgColor}
                                headerIconsColor={headerIconsColor}
                                setHeaderIconsColor={setHeaderIconsColor}
                            />
                        )}

                        {activeSection === 'ui' && (
                            <BrandingUI
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

                        {activeSection === 'typography' && (
                            <BrandingTypography
                                fontFamily={fontFamily}
                                setFontFamily={setFontFamily}
                                fontHeadings={fontHeadings}
                                setFontHeadings={setFontHeadings}
                            />
                        )}

                        {activeSection === 'loader' && (
                            <BrandingLoader
                                loaderType={loaderType}
                                setLoaderType={setLoaderType}
                                loaderCustomUrl={loaderCustomUrl}
                                setLoaderCustomUrl={setLoaderCustomUrl}
                            />
                        )}

                        {activeSection === 'effects' && (
                            <BrandingEffects
                                shadowStyle={shadowStyle}
                                setShadowStyle={setShadowStyle}
                            />
                        )}

                        {activeSection === 'pwa' && (
                            <BrandingAppIcons
                                appleTouchIcon={appleTouchIcon}
                                setAppleTouchIcon={setAppleTouchIcon}
                                androidIcon192={androidIcon192}
                                setAndroidIcon192={setAndroidIcon192}
                                androidIcon512={androidIcon512}
                                setAndroidIcon512={setAndroidIcon512}
                            />
                        )}

                        {activeSection === 'pages' && (
                            <BrandingSystemPages
                                maintenanceIsActive={maintenanceIsActive}
                                setMaintenanceIsActive={setMaintenanceIsActive}
                                maintenanceMessage={maintenanceMessage}
                                setMaintenanceMessage={setMaintenanceMessage}
                                maintenanceReturn={maintenanceReturn}
                                setMaintenanceReturn={setMaintenanceReturn}
                                notFoundImageUrl={notFoundImageUrl}
                                setNotFoundImageUrl={setNotFoundImageUrl}
                                notFoundTitle={notFoundTitle}
                                setNotFoundTitle={setNotFoundTitle}
                            />
                        )}

                        {activeSection === 'sounds' && (
                            <BrandingSounds
                                enabled={soundsEnabled}
                                setEnabled={setSoundsEnabled}
                                volume={soundsVolume}
                                setVolume={setSoundsVolume}
                            />
                        )}

                        {activeSection === 'seo' && (
                            <BrandingSEO
                                title={seoTitle}
                                setTitle={setSeoTitle}
                                description={seoDescription}
                                setDescription={setSeoDescription}
                                ogImage={seoOgImage}
                                setOgImage={setSeoOgImage}
                            />
                        )}

                        {activeSection === 'footer' && (
                            <BrandingFooter
                                text={footerText}
                                setText={setFooterText}
                                showLinks={footerShowLinks}
                                setShowLinks={setFooterShowLinks}
                            />
                        )}

                        {activeSection === 'email' && (
                            <BrandingEmail
                                emailHeaderColor={emailHeaderColor}
                                setEmailHeaderColor={setEmailHeaderColor}
                                emailCtaColor={emailCtaColor}
                                setEmailCtaColor={setEmailCtaColor}
                                emailFooterText={emailFooterText}
                                setEmailFooterText={setEmailFooterText}
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
                                    "--primary": primaryColor.includes(' ') ? `hsl(${primaryColor})` : primaryColor,
                                    "--background": bgColor.includes(' ') ? `hsl(${bgColor})` : bgColor,
                                    "--sidebar": sidebarMenuColor.includes(' ') ? `hsl(${sidebarMenuColor})` : sidebarMenuColor,
                                    "--sidebar-submenu": sidebarSubmenuColor.includes(' ') ? `hsl(${sidebarSubmenuColor})` : sidebarSubmenuColor,
                                    "--border": borderColor.includes(' ') ? `hsl(${borderColor})` : borderColor,
                                    "--card": cardColor.includes(' ') ? `hsl(${cardColor})` : cardColor,
                                    "--hover": hoverColor.includes(' ') ? `hsl(${hoverColor})` : hoverColor,
                                    "--header": headerBgColor.includes(' ') ? `hsl(${headerBgColor})` : headerBgColor,
                                    "--header-icons": headerIconsColor.includes(' ') ? `hsl(${headerIconsColor})` : headerIconsColor,
                                    "--text-primary": textPrimaryColor.includes(' ') ? `hsl(${textPrimaryColor})` : textPrimaryColor,
                                    "--text-secondary": textSecondaryColor.includes(' ') ? `hsl(${textSecondaryColor})` : textSecondaryColor,
                                    "--border-strong": borderStrongColor.includes(' ') ? `hsl(${borderStrongColor})` : borderStrongColor,
                                    "--border-subtle": borderSubtleColor.includes(' ') ? `hsl(${borderSubtleColor})` : borderSubtleColor,
                                    "--scroll-thumb": scrollThumbColor.includes(' ') ? `hsl(${scrollThumbColor})` : scrollThumbColor,
                                    "--radius": `${radius}px`,
                                    "--font-family": fontFamily,
                                } as any}
                            >

                                {/* P R E V I E W   C O N T E N T   W R A P P E R */}
                                <div className="flex flex-col flex-1 relative z-10 bg-black">

                                    {/* Browser Tab Mock */}
                                    <div className="bg-neutral-950 px-4 py-2 flex items-center gap-2 border-b border-white/5 shrink-0 relative z-20">
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
                                    ) : (
                                        <div className="flex-1 bg-[var(--background)] flex flex-col overflow-hidden font-sans">
                                            {/* HEADER FULL WIDTH */}
                                            <div className="h-14 px-6 border-b border-[var(--border)] bg-[var(--header)] flex items-center justify-between shrink-0 relative z-20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0">
                                                        {logoUrl ? <img src={logoUrl} className="w-5 h-5 object-contain" /> : <Zap className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className="h-4 w-px bg-[var(--border)]" />
                                                    <span className="text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase">Uniafy Platform</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-6 h-6 rounded-full border border-[var(--border)] bg-[var(--card)]" />
                                                        <div className="w-6 h-6 rounded-full border border-[var(--border)] bg-[var(--primary)]" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                                                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-transparent opacity-20" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex overflow-hidden">
                                                {/* REALISTIC SIDEBAR MOCKUP */}
                                                <div className="w-16 bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-2 shrink-0">
                                                    {[
                                                        { icon: LayoutGrid, label: 'Master' },
                                                        { icon: Zap, label: 'Growth' },
                                                        { icon: Users, label: 'Agência' },
                                                        { icon: Activity, label: 'Tráfego' }
                                                    ].map((item, i) => (
                                                        <div key={i} className={cn(
                                                            "w-14 h-14 transition-all cursor-pointer gap-1 flex flex-col items-center justify-center rounded-r-xl rounded-l-none",
                                                            i === 1 ? "" : "hover:bg-[var(--hover)] rounded-xl"
                                                        )}
                                                            style={i === 1 ? { borderLeft: '3px solid var(--primary)' } : {}}
                                                        >
                                                            {/* Active Gradient Background Layer */}
                                                            {i === 1 && (
                                                                <div
                                                                    className="absolute inset-0 opacity-25 pointer-events-none"
                                                                    style={{ background: 'linear-gradient(to right, var(--primary), transparent)' }}
                                                                />
                                                            )}

                                                            {/* Icon Glow Layer */}
                                                            {i === 1 && (
                                                                <div
                                                                    className="absolute inset-0 blur-xl opacity-20 pointer-events-none"
                                                                    style={{ background: 'var(--primary)' }}
                                                                />
                                                            )}

                                                            {/* Icon Wrapper Tech Style */}
                                                            <div className={cn(
                                                                "w-8 h-8 flex items-center justify-center transition-all",
                                                                i === 1
                                                                    ? "text-[var(--primary)] scale-110 drop-shadow-[0_0_8px_rgba(255,102,0,0.5)]" // Assuming orange/primary glow, inline style won't take var in rgba easily for shadow so simulating or using text-shadow if needed. Tailwind arb value works.
                                                                    : ""
                                                            )}
                                                                style={i === 1 ? { filter: `drop-shadow(0 0 8px var(--primary))` } : {}}
                                                            >
                                                                <item.icon className="w-5 h-5" />
                                                            </div>



                                                            <span className={cn(
                                                                "text-[9px] font-medium tracking-tight",
                                                                i === 1 ? "text-[var(--primary)]" : "text-current"
                                                            )}>{item.label}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* SUBMENU RETRATIL MOCKUP */}
                                                <div className="w-44 bg-[#121214] border-r border-[var(--border)] flex flex-col pt-6 shrink-0">
                                                    <div className="px-4 mb-8">
                                                        <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Módulo Growth</h4>
                                                        <div className="space-y-1">
                                                            {[
                                                                { text: 'Dashboard', icon: LayoutDashboard },
                                                                { text: 'Scraper', icon: Search },
                                                                { text: 'Sniper', icon: Fingerprint },
                                                                { text: 'Máquina', icon: Zap }
                                                            ].map((item, i) => (
                                                                <div key={i} className={cn(
                                                                    "h-8 flex items-center px-3 gap-2 text-[10px] font-bold transition-all cursor-pointer relative group",
                                                                    i === 1 ? "rounded-r-[var(--radius)] rounded-l-none" : "hover:bg-[var(--hover)] rounded-[var(--radius)]"
                                                                )}
                                                                    style={i === 1 ? { borderLeft: '2px solid var(--primary)' } : {}}
                                                                >
                                                                    {/* Active BG Layer */}
                                                                    {i === 1 && (
                                                                        <div
                                                                            className="absolute inset-0 opacity-20 pointer-events-none rounded-r-[var(--radius)]"
                                                                            style={{ background: 'linear-gradient(to right, var(--primary), transparent)' }}
                                                                        />
                                                                    )}
                                                                    <item.icon className={cn(
                                                                        "w-3.5 h-3.5 transition-all",
                                                                        i === 1 ? "text-[var(--primary)] scale-110" : "text-current opacity-70"
                                                                    )}
                                                                        style={i === 1 ? { filter: `drop-shadow(0 0 5px var(--primary))` } : {}}
                                                                    />
                                                                    <span className={i === 1 ? "text-white" : ""}>{item.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* WORKSPACE CONTENT */}
                                                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#09090b]">
                                                    <div className="flex items-end justify-between mb-8">
                                                        <div className="space-y-1">
                                                            <h3 className="text-[var(--text-secondary)] font-black text-[8px] uppercase tracking-[0.3em]">Visão Geral</h3>
                                                            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight" style={{ fontSize: `${fsTitle}px` }}>Resultados do Dia</h1>
                                                        </div>
                                                        <button className="px-4 py-2 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-[var(--radius)] shadow-xl shadow-[var(--primary)]/20 animate-pulse">Novo Scan</button>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[
                                                            { label: 'Leads Hoje', val: '1,284', grow: '+12%' },
                                                            { label: 'Conversão', val: '4.2%', grow: '+0.5%' },
                                                            { label: 'ROI Ativo', val: '12.4x', grow: '+2.1%' }
                                                        ].map((kpi, i) => (
                                                            <div key={i} className="p-5 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] group hover:border-[var(--primary)]/30 transition-all">
                                                                <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.1em] mb-1">{kpi.label}</p>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-xl font-black text-[var(--text-primary)]" style={{ fontSize: `${fsCardTitle}px` }}>{kpi.val}</span>
                                                                    <span className="text-[8px] font-bold text-emerald-500">{kpi.grow}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* DATA TABLE MOCKUP */}
                                                    <div className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-[var(--card)]">
                                                        <div className="h-10 bg-[var(--hover)] border-b border-[var(--border)] flex items-center px-4 justify-between">
                                                            <div className="flex gap-4">
                                                                <div className="w-24 h-2 bg-[var(--text-secondary)]/10 rounded" />
                                                                <div className="w-16 h-2 bg-[var(--text-secondary)]/10 rounded" />
                                                            </div>
                                                            <Search className="w-3 h-3 text-[var(--text-secondary)]" />
                                                        </div>
                                                        {[1, 2, 3].map(row => (
                                                            <div key={row} className="h-12 border-b border-[var(--border-subtle)] last:border-0 flex items-center px-4 justify-between hover:bg-[var(--hover)] transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-6 h-6 rounded-full bg-[var(--border-subtle)]" />
                                                                    <div className="w-32 h-2 bg-[var(--text-primary)]/5 rounded" />
                                                                </div>
                                                                <div className="w-12 h-4 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20" />
                                                            </div>
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
        </div>

    );
}
