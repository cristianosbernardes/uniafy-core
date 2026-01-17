import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandingConfig {
    name: string;
    logo_url: string | null;
    colors: {
        primary: string;
        secondary: string;
    };
    is_custom_domain: boolean;
}

interface DomainContextType {
    branding: BrandingConfig;
    loading: boolean;
    domain: string;
}

const defaultBranding: BrandingConfig = {
    name: 'Uniafy',
    logo_url: null, // Uses default asset if null
    colors: {
        primary: '#F97316', // Orange-500
        secondary: '#000000'
    },
    is_custom_domain: false
};

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function DomainProvider({ children }: { children: React.ReactNode }) {
    const [branding, setBranding] = useState<BrandingConfig>(defaultBranding);
    const [loading, setLoading] = useState(true);
    const [domain, setDomain] = useState('');

    useEffect(() => {
        const resolveDomain = async () => {
            const hostname = window.location.hostname;
            setDomain(hostname);

            // 1. Dev/Default Domains -> Skip check
            if (hostname.includes('localhost') || hostname.includes('uniafy.com') || hostname.includes('vercel.app')) {
                setBranding(defaultBranding);
                setLoading(false);
                return;
            }

            // 2. Custom Domain -> Fetch Config
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('company_name, branding_logo, branding_colors')
                    .eq('custom_domain', hostname)
                    .maybeSingle();

                if (data) {
                    setBranding({
                        name: data.company_name || 'Agência Parceira',
                        logo_url: data.branding_logo,
                        colors: data.branding_colors || defaultBranding.colors,
                        is_custom_domain: true
                    });

                    // Inject CSS Variables for Dynamic Theming
                    if (data.branding_colors?.primary) {
                        document.documentElement.style.setProperty('--primary', data.branding_colors.primary);
                        // Optional: Calculate foreground contrast logic here if needed
                    }
                } else {
                    // Fallback if domain pointing but not found in DB
                    setBranding(defaultBranding);
                }
            } catch (err) {
                console.error("Domain Resolution Error:", err);
                setBranding(defaultBranding);
            } finally {
                setLoading(false);
            }
        };

        resolveDomain();
    }, []);

    return (
        <DomainContext.Provider value={{ branding, loading, domain }}>
            {children}
        </DomainContext.Provider>
    );
}

export const useDomain = () => {
    const context = useContext(DomainContext);
    if (context === undefined) {
        throw new Error('useDomain must be used within a DomainProvider');
    }
    return context;
};
