import { AgencySubscription, FinancialTransaction, MasterNotificationConfig, Plan } from "@/types/uniafy";

export const MOCK_PLANS: Plan[] = [
    {
        id: 'plan_essential',
        name: 'Essential',
        price: 297,
        period: 'monthly',
        max_users: 3,
        max_connections: 1,
        features: ['Gestão de Leads', 'Kanban Básico', 'Sem White Label'],
        is_active: true
    },
    {
        id: 'plan_scale',
        name: 'Scale',
        price: 597,
        period: 'monthly',
        max_users: 10,
        max_connections: 5,
        features: ['White Label', 'Squads', 'G-Hunter', 'Automação N8N'],
        is_active: true
    },
    {
        id: 'plan_black',
        name: 'Black',
        price: 997,
        period: 'monthly',
        max_users: 999,
        max_connections: 999,
        features: ['Tudo Ilimitado', 'IA Avançada', 'Suporte Dedicado', 'Prioridade'],
        is_active: true
    },
    {
        id: 'plan_enterprise',
        name: 'Enterprise (Master)',
        price: 0,
        period: 'monthly',
        max_users: 9999,
        max_connections: 9999,
        features: ['God Mode', 'Acesso Irrestrito'],
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

export const MOCK_MRR_HISTORY = [
    { month: 'Jul', value: 12500, customers: 18 },
    { month: 'Ago', value: 13200, customers: 20 },
    { month: 'Set', value: 13800, customers: 22 },
    { month: 'Out', value: 14500, customers: 24 },
    { month: 'Nov', value: 15100, customers: 25 },
    { month: 'Dez', value: 16800, customers: 28 },
    { month: 'Jan', value: 18594, customers: 31 }, // Atual
];

export const MOCK_REVENUE_BY_PLAN = [
    { name: 'Growth', value: 12500, color: '#f97316' }, // Primary Orange
    { name: 'Starter', value: 4500, color: '#3b82f6' }, // Blue
    { name: 'Black', value: 8900, color: '#10b981' }, // Emerald
];
