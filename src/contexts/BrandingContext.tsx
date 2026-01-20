import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandingColors {
    primary: string;
    background: string;
    sidebar: string;
    sidebar_active: string;
    sidebar_menu?: string;
    sidebar_submenu?: string;
    header_bg?: string;
    header_icons?: string;
    icons_global?: string;
    // New Advanced Colors
    border?: string;
    card?: string;
    hover?: string;
    text_primary?: string;
    text_secondary?: string;
    border_strong?: string;
    border_subtle?: string;
    scroll_thumb?: string;
    // Multi-profile support
    selected_profile?: string;
    profiles?: Record<string, BrandingColors>;
    // Status Colors
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
}

interface BrandingConfig {
    colors: BrandingColors;
    logo_url?: string;
    favicon_url?: string;
    login?: {
        bg_url?: string;
        overlay_color?: string;
        overlay_opacity?: number;
        title?: string;
        message?: string; // Subtitle/Welcome message
        logo_url?: string; // Specific logo for login if different
        layout?: 'center' | 'split';
        bg_type?: 'image' | 'color' | 'gradient';
        bg_color?: string;
        gradient_start?: string;
        gradient_end?: string;
        gradient_direction?: string;
    };
    ui?: {
        radius?: number;
        fontFamily?: string;
        glass?: {
            blur?: number;
            opacity?: number;
        };
        fontSizes?: {
            base?: number;
            titles?: number; // Page H1
            cardTitles?: number; // Card Headers
            menu?: number;
            submenu?: number;
            small?: number;
            stats?: number; // KPI Numbers
            subtitles?: number; // Descriptions
        };
    };
}

interface BrandingContextType {
    branding: BrandingConfig | null;
    loading: boolean;
    refreshBranding: () => Promise<void>;
    getLoginStyles: () => React.CSSProperties;
    isAgencyBranding: boolean; // Flag to indicate if we're using agency-specific branding
}

const BrandingContext = createContext<BrandingContextType>({
    branding: null,
    loading: true,
    refreshBranding: async () => { },
    getLoginStyles: () => ({}),
    isAgencyBranding: false
});

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [branding, setBranding] = useState<BrandingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAgencyBranding, setIsAgencyBranding] = useState(false);

    // Apply Favicon
    useEffect(() => {
        if (branding?.favicon_url) {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            (link as HTMLLinkElement).type = 'image/x-icon';
            (link as HTMLLinkElement).rel = 'shortcut icon';
            (link as HTMLLinkElement).href = branding.favicon_url;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }, [branding?.favicon_url]);

    const getLoginStyles = (): React.CSSProperties => {
        if (!branding?.login) return {};

        const { bg_type, bg_url, bg_color, gradient_start, gradient_end, gradient_direction } = branding.login;

        if (bg_type === 'image' && bg_url) {
            return {
                backgroundImage: `url(${bg_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            };
        }

        if (bg_type === 'color' && bg_color) {
            return {
                backgroundColor: bg_color
            };
        }

        if (bg_type === 'gradient' && gradient_start && gradient_end) {
            return {
                backgroundImage: `linear-gradient(${gradient_direction || 'to bottom right'}, ${gradient_start}, ${gradient_end})`
            };
        }

        // Fallback to old behavior
        if (bg_url) {
            return {
                backgroundImage: `url(${bg_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            };
        }

        return {};
    };

    const applyTheme = (config: BrandingConfig) => {
        const root = document.documentElement;

        // Get active color set (either from profile or top-level)
        let colors = config.colors;
        if (config.colors?.selected_profile && config.colors.profiles?.[config.colors.selected_profile]) {
            colors = { ...config.colors, ...config.colors.profiles[config.colors.selected_profile] };
        }

        // 1. COLORS
        if (colors) {
            const formatHsl = (val: string) => {
                if (!val) return '';
                if (val.includes('hsl')) return val;
                return `hsl(${val})`;
            };

            // Raw numbers for Tailwind hsl(var(--primary)) format (compatibility)
            if (colors.primary) root.style.setProperty('--primary', colors.primary);
            if (colors.background) root.style.setProperty('--background', colors.background);

            // Advanced colors with HSL wrapper for direct CSS usage
            if (colors.border) root.style.setProperty('--border-industrial', formatHsl(colors.border));
            if (colors.card) {
                root.style.setProperty('--card-industrial', formatHsl(colors.card));
                root.style.setProperty('--card', colors.card.includes(' ') ? `hsl(${colors.card})` : colors.card);
            }
            if (colors.hover) {
                root.style.setProperty('--hover-industrial', formatHsl(colors.hover));
                root.style.setProperty('--hover', colors.hover.includes(' ') ? `hsl(${colors.hover})` : colors.hover);
            }

            if (colors.text_primary) {
                root.style.setProperty('--text-primary', formatHsl(colors.text_primary));
                const hslVal = colors.text_primary.includes('/') ? colors.text_primary.split('/')[0].trim() : colors.text_primary;
                root.style.setProperty('--foreground', hslVal);
            }

            if (colors.text_secondary) {
                root.style.setProperty('--text-secondary', formatHsl(colors.text_secondary));
                const hslVal = colors.text_secondary.includes('/') ? colors.text_secondary.split('/')[0].trim() : colors.text_secondary;
                root.style.setProperty('--muted-foreground', hslVal);
            }

            if (colors.border_strong) {
                root.style.setProperty('--border-strong', formatHsl(colors.border_strong));
                root.style.setProperty('--border', colors.border_strong.split('/')[0].trim());
            }

            if (colors.border_subtle) {
                root.style.setProperty('--border-subtle', formatHsl(colors.border_subtle));
                root.style.setProperty('--border-industrial', formatHsl(colors.border_subtle));
            }

            if (colors.scroll_thumb) {
                root.style.setProperty('--scroll-thumb', formatHsl(colors.scroll_thumb));
            }

            // Full color values for layout components
            if (colors.sidebar_menu) {
                root.style.setProperty('--bg-layout-menu', formatHsl(colors.sidebar_menu));
            } else if (colors.sidebar) {
                root.style.setProperty('--bg-layout-menu', formatHsl(colors.sidebar));
            }

            if (colors.sidebar_submenu) {
                root.style.setProperty('--bg-layout-submenu', formatHsl(colors.sidebar_submenu));
            } else if (colors.sidebar) {
                root.style.setProperty('--bg-layout-submenu', formatHsl(colors.sidebar));
            }

            if (colors.background) {
                const bgHsl = formatHsl(colors.background);
                root.style.setProperty('--bg-layout-workspace', bgHsl);
                root.style.setProperty('--bg-layout-base', bgHsl);
            }

            // HEADER & ICONS
            if (colors.header_bg) {
                root.style.setProperty('--header-bg', formatHsl(colors.header_bg));
            }
            if (colors.header_icons) {
                root.style.setProperty('--header-icon-color', formatHsl(colors.header_icons));
            }
            if (colors.icons_global) {
                root.style.setProperty('--icons-global', formatHsl(colors.icons_global));
            }
        }

        // 2. UI SHAPE (Radius)
        if (config.ui?.radius !== undefined) {
            root.style.setProperty('--radius', `${config.ui.radius}rem`);
        }

        // 3. TYPOGRAPHY (Font Family)
        if (config.ui?.fontFamily) {
            const fontName = config.ui.fontFamily;
            // Load Font from Google Fonts
            const linkId = 'dynamic-font-loader';
            let link = document.getElementById(linkId) as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            // Simple mapping for Google Fonts to URL friendly
            const fontUrlParam = fontName.replace(/\s+/g, '+');
            link.href = `https://fonts.googleapis.com/css2?family=${fontUrlParam}:wght@300;400;500;600;700&display=swap`;

            // Apply CSS Variable
            root.style.setProperty('--font-sans', `"${fontName}", sans-serif`);
        }

        // 3.5 STATUS COLORS
        if (config.colors) {
            const setStatusColor = (varName: string, value?: string) => {
                if (!value) return;
                // If it's HSL format "H S L", set as is for hsla() usage
                // If it's a hex or other, we might need a converter, but for now we assume HSL components
                root.style.setProperty(varName, value);
            };

            setStatusColor('--status-success', config.colors.success);
            setStatusColor('--status-warning', config.colors.warning);
            setStatusColor('--status-error', config.colors.error);
            setStatusColor('--status-info', config.colors.info);
        }

        // 3.6 GLASS EFFECT
        if (config.ui?.glass) {
            if (config.ui.glass.blur !== undefined) root.style.setProperty('--glass-blur', `${config.ui.glass.blur}px`);
            if (config.ui.glass.opacity !== undefined) root.style.setProperty('--glass-opacity', `${config.ui.glass.opacity}`);
        }

        // 4. FONT SIZES (Scaling)
        if (config.ui?.fontSizes) {
            if (config.ui.fontSizes.base) root.style.setProperty('--fs-base', `${config.ui.fontSizes.base}px`); // Body default
            if (config.ui.fontSizes.titles) root.style.setProperty('--fs-title', `${config.ui.fontSizes.titles}px`); // Page Titles
            if (config.ui.fontSizes.cardTitles) root.style.setProperty('--fs-card-title', `${config.ui.fontSizes.cardTitles}px`); // Card Headers
            if (config.ui.fontSizes.menu) root.style.setProperty('--fs-menu', `${config.ui.fontSizes.menu}px`); // Sidebar/Menu
            if (config.ui.fontSizes.submenu) root.style.setProperty('--fs-submenu', `${config.ui.fontSizes.submenu}px`); // Submenu Items
            if (config.ui.fontSizes.small) root.style.setProperty('--fs-small', `${config.ui.fontSizes.small}px`); // Hints
            if (config.ui.fontSizes.stats) root.style.setProperty('--fs-stats', `${config.ui.fontSizes.stats}px`); // KPI Numbers
            if (config.ui.fontSizes.subtitles) root.style.setProperty('--fs-subtitle', `${config.ui.fontSizes.subtitles}px`); // Descriptions
        }
    };

    const refreshBranding = async () => {
        try {
            // 1. First, check if there's a logged in user with its own branding
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('branding_colors, branding_logo, custom_domain')
                    .eq('id', session.user.id)
                    .maybeSingle();

                // If 403 or not found, we don't log error, just fallback to system branding
                if (profileError && profileError.code !== '42501') {
                    console.error('Profile fetch error:', profileError);
                }

                if (!profileError && profile && (profile.branding_colors || profile.branding_logo)) {
                    const agencyBranding: BrandingConfig = {
                        colors: profile.branding_colors as any || { primary: "24 100% 52%", background: "240 10% 2%" },
                        logo_url: profile.branding_logo || "",
                        // For agency branding, we use default UI or from global if needed
                        ui: { radius: 0.5, fontFamily: "Inter" }
                    };

                    setBranding(agencyBranding);
                    applyTheme(agencyBranding);
                    setIsAgencyBranding(true);
                    setLoading(false);
                    return;
                }
            }

            // 2. Fallback to Global System Branding (Master Config)
            const { data, error } = await supabase
                .from('master_config')
                .select('branding')
                .limit(1)
                .single();

            if (error) {
                console.error('Error fetching branding:', error);
                return;
            }

            if (data?.branding) {
                // Parse JSONB
                const config = typeof data.branding === 'string'
                    ? JSON.parse(data.branding)
                    : data.branding;

                setBranding(config);
                applyTheme(config);
                setIsAgencyBranding(false);
            }
        } catch (err) {
            console.error('Failed to load branding:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshBranding();

        // Listen for auth changes to re-fetch branding (e.g. login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            refreshBranding();
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <BrandingContext.Provider value={{ branding, loading, refreshBranding, getLoginStyles, isAgencyBranding }}>
            {children}
        </BrandingContext.Provider>
    );
};

