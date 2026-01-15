import { supabase } from "@/integrations/supabase/client";
import { AgencySubscription, MasterNotificationConfig, Plan } from "@/types/uniafy";

export const masterService = {
    // --- PLANS ---
    async getPlans(): Promise<Plan[]> {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .order('price', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // --- SUBSCRIPTIONS ---
    async getSubscriptions(): Promise<AgencySubscription[]> {
        // Join with Plans to get details if needed, or simple select
        // In real world we join 'tenants' table to get name, here we might assume it exists or mock the name join
        const { data, error } = await supabase
            .from('subscriptions')
            .select(`
        *,
        plans (name)
      `) // Assuming relation setup
            .order('next_billing_date', { ascending: true });

        if (error) throw error;

        // Map to our Interface (Adapting structure)
        return data.map((sub: any) => ({
            ...sub,
            tenant_name: 'Agência (ID: ' + sub.tenant_id.substring(0, 4) + ')', // Placeholder name if tenants table not joined
            plan_name: sub.plans?.name
        }));
    },

    async getMySubscription(tenantId: string): Promise<AgencySubscription | null> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('tenant_id', tenantId) // Assuming current user has tenant_id
            .single();

        if (error) return null;
        return data;
    },

    // --- CONFIG ---
    async getGlobalConfig(): Promise<MasterNotificationConfig | null> {
        const { data, error } = await supabase
            .from('master_config')
            .select('*')
            .limit(1)
            .single();

        if (error) return null;
        return data;
    },

    async updateGlobalConfig(config: MasterNotificationConfig) {
        if (!config.id) throw new Error("Config ID is missing");

        const { error } = await supabase
            .from('master_config')
            .update({
                trigger_days_before: config.trigger_days_before,
                message_title: config.message_title,
                message_body: config.message_body,
                is_active: config.is_active,
                channels: config.channels
            })
            .eq('id', config.id);

        if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
        }
    }
};
