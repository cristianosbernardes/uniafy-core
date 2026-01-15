
import { supabase } from "@/integrations/supabase/client";

export interface AgencySettings {
    custom_domain?: string | null;
    branding_logo?: string | null;
    branding_colors?: {
        primary: string;
        secondary: string;
    };
}

export const agencyService = {
    // Busca as configurações da agência do perfil do usuário atual
    async getSettings(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('custom_domain, branding_logo, branding_colors')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as AgencySettings;
    },

    // Atualiza as configurações de white label
    async updateSettings(userId: string, settings: AgencySettings) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                custom_domain: settings.custom_domain,
                branding_logo: settings.branding_logo,
                branding_colors: settings.branding_colors
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Verifica disponibilidade do domínio (Simulação - idealmente seria uma Edge Function)
    async checkDomainAvailability(domain: string) {
        // Mock: Simula check DNS
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    },

    // --- GESTÃO DE EQUIPE ---

    async getTeamMembers(agencyId: string) {
        // Busca usuários onde parent_agency_id é igual ao ID da agência
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('parent_agency_id', agencyId);

        if (error) throw error;
        return data as any[]; // Idealmente tipar com Interface Profile
    },

    async inviteMember(agencyId: string, email: string, role: string, fullName: string) {
        // 1. Em um cenário real, chamaria uma Edge Function para usar supabase.auth.admin.inviteUserByEmail
        // 2. Aqui vamos simular criando o perfil diretamente ou chamando um RPC se existisse

        // Mock connection para UI Frontend:
        console.log("Simulating invite:", { agencyId, email, role, fullName });
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    },

    async removeMember(memberId: string) {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', memberId);

        if (error) throw error;
    },

    // --- GESTÃO DE CLIENTES ---

    async getClients(agencyId: string) {
        // Busca perfis com role 'client' vinculados à agência
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('parent_agency_id', agencyId)
            .eq('role', 'client');

        if (error) throw error;
        return data as any[];
    },

    async createClient(agencyId: string, clientData: any) {
        // Mock: Simula criação de cliente com dados do Onboarding Mágico
        console.log("🚀 Iniciando Onboarding Mágico:", { agencyId, ...clientData });

        // Simulação de delay para "Processamento IA" e "Webhooks"
        await new Promise(resolve => setTimeout(resolve, 2500));

        console.log("✅ Webhook disparado: CRM atualizado");
        console.log("✅ Estrutura de pastas criada no Drive");
        console.log("✅ Convite de acesso enviado");

        return { success: true, id: crypto.randomUUID() };
    }
};
