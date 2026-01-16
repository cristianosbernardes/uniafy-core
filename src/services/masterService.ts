import { supabase } from "@/integrations/supabase/client";
import { AgencySubscription, MasterNotificationConfig, Plan } from "@/types/uniafy";

export const masterService = {
    // --- PLANS ---
    async getPlans(): Promise<Plan[]> {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .order('monthly_price_amount', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // --- SUBSCRIPTIONS ---
    async getSubscriptions(): Promise<AgencySubscription[]> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select(`
                *,
                plan:plans(name), 
                profile:profiles(company_name, email)
            `)
            .order('next_billing_date', { ascending: true });

        if (error) throw error;

        // Map to our Interface (Adapting structure)
        return data.map((sub: any) => ({
            ...sub,
            tenant_name: sub.profile?.company_name || sub.profile?.email || 'Agência Desconhecida',
            plan_name: sub.plan?.name || sub.plan_id
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

    async updateSubscriptionStatus(subscriptionId: string, status: 'active' | 'past_due' | 'canceled' | 'trial') {
        const { error } = await supabase
            .from('subscriptions')
            .update({ status })
            .eq('id', subscriptionId);

        if (error) throw error;
    },

    async createClient(data: { name: string; email: string; password: string; planId: string }) {
        // SQL Injection protection is minimal here because values are injected into string literals.
        // In a production env with unsafe inputs, we should use parameterized queries or specific RPCs.
        // Since this is a Master Admin tool, we'll sanitise simply by escaping single quotes.
        const safeEmail = data.email.replace(/'/g, "''");
        const safeName = data.name.replace(/'/g, "''");
        const safePass = data.password.replace(/'/g, "''");
        const safePlan = data.planId.replace(/'/g, "''");

        const sql = `
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    plan_cost NUMERIC;
BEGIN
    -- Get Plan Cost
    SELECT monthly_price_amount INTO plan_cost FROM public.plans WHERE id = '${safePlan}';

    -- 1. Create Auth User (Standard Supabase Auth)
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000', -- Default Instance ID
        '${safeEmail}',
        crypt('${safePass}', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"company_name": "${safeName}"}',
        'authenticated',
        'authenticated'
    );

    -- 2. Create Identity (Supabase requires this for login to work properly in some versions, often triggered auto but safest to add if manually inserting)
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        new_user_id,
        format('{"sub":"%s","email":"%s"}', new_user_id::text, '${safeEmail}')::jsonb,
        'email',
        now(),
        now(),
        now()
    );

    -- 3. Create Profile
    INSERT INTO public.profiles (id, email, company_name, role)
    VALUES (new_user_id, '${safeEmail}', '${safeName}', 'AGENCY');

    -- 4. Create Subscription
    INSERT INTO public.subscriptions (tenant_id, plan_id, status, amount, payment_method)
    VALUES (
        new_user_id,
        '${safePlan}',
        'active',
        COALESCE(plan_cost, 0),
        'MANUAL'
    );
END $$;
`;

        const { error } = await supabase.rpc('admin_exec_sql', { sql_query: sql });
        if (error) throw error;
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
