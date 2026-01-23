import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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


            // Persist selection            const allRawClients = [...data, ...MOCK_CLIENTS];
            const formattedClients: TrafficClient[] = allRawClients.map((c: any) => ({
                id: c.id,
                email: c.email,
                company_name: c.company_name || c.full_name || 'Cliente Sem Nome',
                branding_logo: c.branding_logo
            }));

            setClients(formattedClients);

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

    const contextValue = useMemo(() => ({
        clients,
        selectedClient,
        isLoading,
        selectClient,
        refreshClients
    }), [clients, selectedClient, isLoading]);

    return (
        <TrafficContext.Provider value={contextValue}>
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
