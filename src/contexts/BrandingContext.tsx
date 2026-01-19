import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandingColors {
    primary: string;
    background: string;
    sidebar: string;
    sidebar_active: string;
    // New Advanced Colors
    border?: string;
    card?: string;
    hover?: string;
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
    };
    ui?: {
        radius?: number;
        fontFamily?: string;
        fontSizes?: {
            base?: number;
            titles?: number; // Page H1
            cardTitles?: number; // Card Headers
            menu?: number;
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
}

const BrandingContext = createContext<BrandingContextType>({
    branding: null,
    loading: true,
    refreshBranding: async () => { },
    getLoginStyles: () => ({}),
});

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [branding, setBranding] = useState<BrandingConfig | null>(null);
    const [loading, setLoading] = useState(true);

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
        if (!branding?.login?.bg_url) return {};

        return {
            backgroundImage: `url(${branding.login.bg_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    };

    const applyTheme = (config: BrandingConfig) => {
        const root = document.documentElement;

        // 1. COLORS
        if (config.colors) {
            if (config.colors.primary) root.style.setProperty('--primary', config.colors.primary);
            if (config.colors.background) root.style.setProperty('--background', config.colors.background);
            if (config.colors.sidebar) root.style.setProperty('--bg-layout-menu', config.colors.sidebar);

            // Advanced UI Colors
            if (config.colors.border) root.style.setProperty('--border-color', config.colors.border);
            if (config.colors.card) root.style.setProperty('--card-bg', config.colors.card);
            if (config.colors.hover) root.style.setProperty('--hover-bg', config.colors.hover);
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

        // 4. FONT SIZES (Scaling)
        if (config.ui?.fontSizes) {
            if (config.ui.fontSizes.base) root.style.setProperty('--fs-base', `${config.ui.fontSizes.base}px`); // Body default
            if (config.ui.fontSizes.titles) root.style.setProperty('--fs-title', `${config.ui.fontSizes.titles}px`); // Page Titles
            if (config.ui.fontSizes.cardTitles) root.style.setProperty('--fs-card-title', `${config.ui.fontSizes.cardTitles}px`); // Card Headers
            if (config.ui.fontSizes.menu) root.style.setProperty('--fs-menu', `${config.ui.fontSizes.menu}px`); // Sidebar/Menu
            if (config.ui.fontSizes.small) root.style.setProperty('--fs-small', `${config.ui.fontSizes.small}px`); // Hints
            if (config.ui.fontSizes.stats) root.style.setProperty('--fs-stats', `${config.ui.fontSizes.stats}px`); // KPI Numbers
            if (config.ui.fontSizes.subtitles) root.style.setProperty('--fs-subtitle', `${config.ui.fontSizes.subtitles}px`); // Descriptions
        }
    };

    const refreshBranding = async () => {
        try {
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
                    : data.branding; // Supabase client might auto-parse

                setBranding(config);
                applyTheme(config);
            }
        } catch (err) {
            console.error('Failed to load branding:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshBranding();
    }, []);

    return (
        <BrandingContext.Provider value={{ branding, loading, refreshBranding, getLoginStyles }}>
            {children}
        </BrandingContext.Provider>
    );
};
