-- PROMPT TÉCNICO: REESTRUTURAÇÃO DE PLANOS E SKUs (UNIAFY V2)
-- Objetivo: Padronizar arquitetura de Planos no DB

-- 1. Limpar tabela antiga se existir (Cuidado em produção: isso apaga dados!)
DROP TABLE IF EXISTS plans CASCADE;

-- 2. Criar tabela com nova estrutura
CREATE TABLE plans (
    id TEXT PRIMARY KEY, -- e.g. plan_essential
    name TEXT NOT NULL,
    description TEXT,
    monthly_price_id TEXT NOT NULL, -- e.g. essential_monthly
    yearly_price_id TEXT NOT NULL, -- e.g. essential_yearly
    monthly_price_amount NUMERIC(10, 2) DEFAULT 0,
    yearly_price_amount NUMERIC(10, 2) DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    period TEXT DEFAULT 'monthly', -- legacy compatibility field if needed
    max_users INTEGER DEFAULT 1,
    max_connections INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inserir Planos Oficiais
INSERT INTO plans (
    id, name, description, 
    monthly_price_id, yearly_price_id, 
    monthly_price_amount, yearly_price_amount, 
    features, max_users, max_connections, is_active
) VALUES
    (
        'plan_essential',
        'Essential',
        'Acesso básico (Gestor Solo, sem White Label)',
        'essential_monthly',
        'essential_yearly',
        297.00,
        2970.00,
        '["Gestão de Leads", "Kanban Básico", "Até 3 Usuários", "Sem White Label"]'::jsonb,
        3,
        1,
        true
    ),
    (
        'plan_scale',
        'Scale',
        'Acesso Agência (White Label ativo, Squads limitados)',
        'scale_monthly',
        'scale_yearly',
        597.00,
        5970.00,
        '["White Label", "Até 10 Usuários", "Squads", "G-Hunter", "Automação N8N"]'::jsonb,
        10,
        5,
        true
    ),
    (
        'plan_black',
        'Black',
        'Acesso Full (IA Ilimitada, Squads Ilimitados, Prioridade)',
        'black_monthly',
        'black_yearly',
        997.00,
        9970.00,
        '["Tudo Ilimitado", "IA Avançada", "Suporte Dedicado", "N8N Integrado", "Prioridade no Suporte"]'::jsonb,
        999,
        999,
        true
    ),
    (
        'plan_enterprise',
        'Enterprise (Master)',
        'Plano Super-Admin para controle total',
        'enterprise_monthly',
        'enterprise_yearly',
        0.00,
        0.00,
        '["God Mode", "Acesso Irrestrito", "Gestão Global"]'::jsonb,
        9999,
        9999,
        true
    );

-- 4. Criar Policies RLS (Row Level Security)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de planos ativos (para checkout)
CREATE POLICY "Public Read Plans" ON plans
    FOR SELECT
    USING (true);

-- Permitir modificação apenas por Master (implementado via RPC ou Role de Serviço futuramente)
-- Por enquanto, deixamos aberto para authenticated users que forem admins (validado no app via God Mode)
CREATE POLICY "Admin Manage Plans" ON plans
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));
