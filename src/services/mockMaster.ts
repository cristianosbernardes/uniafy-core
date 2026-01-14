import { AgencySubscription, FinancialTransaction, MasterNotificationConfig, Plan } from "@/types/uniafy";

export const MOCK_PLANS: Plan[] = [
    {
        id: 'plan-basic',
        name: 'Uniafy Starter',
        price: 297,
        period: 'monthly',
        max_users: 3,
        max_connections: 1,
        features: ['Gestão de Leads', 'Kanban Básico'],
        is_active: true
    },
    {
        id: 'plan-pro',
        name: 'Uniafy Growth',
        price: 597,
        period: 'monthly',
        max_users: 10,
        max_connections: 5,
        features: ['G-Hunter', 'Automação N8N', 'Whitelabel'],
        is_active: true
    },
    {
        id: 'plan-black',
        name: 'Uniafy Black',
        price: 997,
        period: 'monthly',
        max_users: 999,
        max_connections: 999,
        features: ['Tudo Ilimitado', 'Suporte Dedicado'],
        is_active: true
    }
];

export const MOCK_SUBSCRIPTIONS: AgencySubscription[] = [
    {
        id: 'sub-001',
        tenant_id: 'agency-alpha',
        tenant_name: 'Agência Alpha',
        plan_id: 'plan-pro',
        status: 'active',
        start_date: '2023-11-01',
        next_billing_date: new Date(Date.now() + 86400000 * 5).toISOString(), // Vence em 5 dias
        amount: 597,
        payment_method: 'CC'
    },
    {
        id: 'sub-002',
        tenant_id: 'agency-beta',
        tenant_name: 'Beta Marketing',
        plan_id: 'plan-basic',
        status: 'past_due',
        start_date: '2023-10-15',
        next_billing_date: new Date(Date.now() - 86400000 * 2).toISOString(), // Venceu há 2 dias
        amount: 297,
        payment_method: 'BOLETO'
    },
    {
        id: 'sub-003',
        tenant_id: 'agency-gamma',
        tenant_name: 'Gamma Growth',
        plan_id: 'plan-black',
        status: 'active',
        start_date: '2023-12-01',
        next_billing_date: new Date(Date.now() + 86400000 * 25).toISOString(), // Vence em 25 dias
        amount: 997,
        payment_method: 'PIX'
    }
];

export const MOCK_NOTIFICATION_CONFIG: MasterNotificationConfig = {
    id: 'config-001',
    trigger_days_before: 3,
    message_title: 'Aviso Importante',
    message_body: 'Sua fatura vence em breve. Evite o bloqueio dos serviços.',
    is_active: true,
    channels: {
        popup: true,
        email: true,
        whatsapp: false
    }
};

export const MOCK_TRANSACTIONS: FinancialTransaction[] = [
    { id: 'tx-001', tenant_id: 'agency-alpha', tenant_name: 'Agência Alpha', date: '2024-01-01', amount: 597, status: 'paid', type: 'subscription' },
    { id: 'tx-002', tenant_id: 'agency-alpha', tenant_name: 'Agência Alpha', date: '2023-12-01', amount: 597, status: 'paid', type: 'subscription' },
    { id: 'tx-003', tenant_id: 'agency-beta', tenant_name: 'Beta Marketing', date: '2023-12-15', amount: 297, status: 'failed', type: 'subscription' },
];
