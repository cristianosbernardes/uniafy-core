import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

export interface TrafficClient {
    id: string;
    email: string;
    company_name: string;
    branding_logo?: string;
    // Ad accounts usually come from another table, but we'll mock or fetch later
    ad_accounts?: {
        meta?: string;
        google?: string;
    };
}

interface TrafficContextType {
    clients: TrafficClient[];
    selectedClient: TrafficClient | null;
    isLoading: boolean;
    selectClient: (clientId: string) => void;
    refreshClients: () => Promise<void>;
}

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export function TrafficProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [clients, setClients] = useState<TrafficClient[]>([]);
    const [selectedClient, setSelectedClient] = useState<TrafficClient | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshClients = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Fetch clients linked to this agency
            // If user is MASTER, maybe fetch all? For now assume User is Agency or Master acting as Agency
            // If user is CLIENT, they only see themselves.

            let data: any[] = [];

            if (user.role === 'client') {
                // Self
                data = [{
                    id: user.id,
                    email: user.email,
                    company_name: user.name, // or agency_name fallback
                    branding_logo: user.avatar
                }];
            } else {
                // Agency/Master: Fetch managed clients
                // NOTE: passing user.id as agencyId. 
                // If Master, we might need a way to select Agency first, but let's assume Master = Agency for now or use the user's agency_id
                // data = await agencyService.getClients(user.id); // Uncomment for real data
                data = []; // Start with empty to use mocks
            }

            // --- MOCK DATA FOR TESTING ---
            const MOCK_CLIENTS = [
                { id: 'mock-1', email: 'contato@techsolutions.com', company_name: 'Tech Solutions Ltda', branding_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS' },
                { id: 'mock-2', email: 'fin@padaria.com.br', company_name: 'Padaria Artesanal', branding_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PA' },
                { id: 'mock-3', email: 'mkt@clinica.med.br', company_name: 'Clínica Dr. João', branding_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CJ' },
                { id: 'mock-4', email: 'loja@moveis.com', company_name: 'Império dos Móveis', branding_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IM' },
                { id: 'mock-5', email: 'adm@construtora.com', company_name: 'Construtora Elite', branding_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CE' }
            ];

            // Merge Real + Mock
            const allRawClients = [...data, ...MOCK_CLIENTS];

            const formattedClients: TrafficClient[] = allRawClients.map((c: any) => ({
                id: c.id,
                email: c.email,
                company_name: c.company_name || c.full_name || 'Cliente Sem Nome',
                branding_logo: c.branding_logo
            }));

            setClients(formattedClients);

            // Persist selection
            const savedId = localStorage.getItem('uniafy_traffic_selected_client');
            if (savedId) {
                const found = formattedClients.find(c => c.id === savedId);
                if (found) setSelectedClient(found);
                else if (formattedClients.length > 0) setSelectedClient(formattedClients[0]);
            } else if (formattedClients.length > 0) {
                setSelectedClient(formattedClients[0]);
            }

        } catch (error) {
            console.error("Erro ao carregar clientes de tráfego:", error);
            toast.error("Falha ao carregar lista de clientes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshClients();
    }, [user]);

    const selectClient = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setSelectedClient(client);
            localStorage.setItem('uniafy_traffic_selected_client', clientId);
            toast.info(`Cliente alterado: ${client.company_name}`);
        }
    };

    return (
        <TrafficContext.Provider value={{ clients, selectedClient, isLoading, selectClient, refreshClients }}>
            {children}
        </TrafficContext.Provider>
    );
}

export function useTraffic() {
    const context = useContext(TrafficContext);
    if (context === undefined) {
        throw new Error('useTraffic must be used within a TrafficProvider');
    }
    return context;
}
