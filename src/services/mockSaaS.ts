import { AuditLog, TelemetryEvent, SaasMetric } from "@/types/uniafy";
import { subDays, subHours, subMinutes, format } from "date-fns";

// --- AUDIT LOGS GENERATOR ---

const ACTORS = [
    { id: 'usr_01', name: 'Cristiano Bernardes' },
    { id: 'usr_02', name: 'Sistema Automático' },
    { id: 'usr_03', name: 'Suporte N1' }
];

const ACTIONS = ['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPERSONATE'];
const TARGETS = ['Agência Alpha', 'Agência Beta', 'Configurações Globais', 'Plano Growth', 'Tabela de Preços'];

export const generateMockAuditLogs = (count: number = 50): AuditLog[] => {
    return Array.from({ length: count }).map((_, i) => {
        const actor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)] as any;
        const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];

        // Data decrescente
        const date = subHours(new Date(), i * 2);

        return {
            id: `log_${i}`,
            actor_id: actor.id,
            actor_name: actor.name,
            action: action,
            target: target,
            metadata: {
                details: `Executou ${action} em ${target}`,
                browser: 'Chrome 120.0.0',
                os: 'Windows 11'
            },
            ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
            created_at: date.toISOString()
        };
    });
};

export const MOCK_AUDIT_LOGS = generateMockAuditLogs(50);


// --- TELEMETRY GENERATOR ---

const MODULES = ['growth/hunter', 'traffic/auditor', 'agency/squads', 'success/health'];

export const generateMockTelemetry = (count: number = 100): TelemetryEvent[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `evt_${i}`,
        user_id: `usr_${Math.floor(Math.random() * 10)}`,
        module: MODULES[Math.floor(Math.random() * MODULES.length)],
        action: 'access',
        timestamp: subMinutes(new Date(), i * 15).toISOString()
    }));
};

export const MOCK_TELEMETRY = generateMockTelemetry(100);

// --- SAAS METRICS ---

export const MOCK_SAAS_METRICS: SaasMetric[] = [
    { label: 'MRR Real', value: 45900, change: 12.5, period: 'vs. mês anterior', trend: 'up' },
    { label: 'ARR (Anualizado)', value: 550800, change: 12.5, period: 'projeção', trend: 'up' },
    { label: 'Novas Assinaturas', value: 15, change: 5, period: 'últimos 30 dias', trend: 'up' },
    { label: 'Churn Rate', value: 2.1, change: -0.5, period: 'taxa mensal', trend: 'down' }, // Down is good for churn
    { label: 'LTV Médio', value: 3200, change: 150, period: 'por cliente', trend: 'up' }
];

// --- WHITE LABEL DOMAINS ---

import { CustomDomain } from "@/types/uniafy";

export const MOCK_DOMAINS: CustomDomain[] = [
    {
        id: 'dom_01',
        domain: 'app.agenciaalpha.com.br',
        tenant_id: 'agency-alpha',
        status: 'active',
        dns_record_type: 'CNAME',
        dns_record_value: 'cname.uniafy.com',
        created_at: '2023-11-20T10:00:00Z',
        branding: { primary_color: '#FF5500' }
    },
    {
        id: 'dom_02',
        domain: 'dash.betamarketing.com',
        tenant_id: 'agency-beta',
        status: 'pending_dns',
        dns_record_type: 'CNAME',
        dns_record_value: 'cname.uniafy.com',
        created_at: new Date().toISOString(), // Hoje
        branding: { primary_color: '#0088FF' }
    },
    {
        id: 'dom_03',
        domain: 'gamma.growth.io',
        tenant_id: 'agency-gamma',
        status: 'ssl_error',
        dns_record_type: 'CNAME',
        dns_record_value: 'cname.uniafy.com',
        created_at: '2023-12-05T14:30:00Z'
    }
];
