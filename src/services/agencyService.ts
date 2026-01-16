
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


        // Simulação de delay para "Processamento IA" e "Webhooks"
        await new Promise(resolve => setTimeout(resolve, 2500));



        return { success: true, id: crypto.randomUUID() };
    },

    // --- FINANCEIRO & ASSINATURA ---

    async getMySubscription(agencyId: string) {
        const { data, error } = await supabase
            .from('subscriptions')
            .select(`
                *,
                plan:plans(*)
            `)
            .eq('tenant_id', agencyId)
            .maybeSingle();

        if (error) return null;
        return data;
    },

    async getInvoices(agencyId: string) {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('tenant_id', agencyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn("Could not fetch invoices (Table might not exist yet)", error);
            return [];
        }
        return data;
    },

    async subscribePlan(agencyId: string, planId: string, price: number) {
        // 1. CHECKOUT SIMULADO (Mock)
        // Em produção, isso chamaria uma Edge Function que falaria com Stripe/Asaas
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Atualizar Assinatura Localmente
        const { error: subError } = await supabase
            .from('subscriptions')
            .update({
                plan_id: planId,
                status: 'active',
                amount: price,
                current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
            })
            .eq('tenant_id', agencyId);

        if (subError) throw subError;

        // 3. Gerar Fatura (Invoice) de Registro
        // Usamos RPC se disponível ou insert direto (se RLS permitir insert pelo user - geralmente não, mas simularemos)
        // Para segurança real: Chamar RPC 'create_invoice'
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                tenant_id: agencyId,
                plan_id: planId,
                status: 'active',
                start_date: new Date().toISOString(),
                next_billing_date: nextYear.toISOString(), // Mock: 1 ano
                amount: 99.90, // Mock price
                payment_method: 'CC'
            }, { onConflict: 'tenant_id' }) as any; // Type cast 'as any' to bypass strict type check if types aren't regenerated yet

        if (error) console.warn("Erro ao gerar fatura de log:", error);

        return { success: true };
    }
};

