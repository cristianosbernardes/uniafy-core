import { useState } from 'react';
import { Database, Play, Trash2, List, Code, AlertTriangle, CheckCircle2, XCircle, Clock, Users, Receipt, Shield, Key, ShieldCheck, Zap, Palette, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Preset {
    id: string;
    title: string;
    query: string;
    icon: React.ReactNode;
    category: 'utility' | 'setup';
}

const PRESETS: Preset[] = [
    {
        id: 'fix-permissions-rls-v1',
        title: '[SISTEMA] Corrigir Permissões RLS (Agência)',
        query: `-- FIX PERMISSIONS & RLS

-- 1. PLANS: Public Read
ALTER TABLE public.plans DISABLE ROW LEVEL SECURITY;
-- OR enable and add public policy
-- ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Plans Read" ON public.plans FOR SELECT USING (true);


-- 2. SUBSCRIPTIONS: Read Own
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = tenant_id);

-- 3. PROFILES: Read Own & Team
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Agencies can view team members" ON public.profiles;
CREATE POLICY "Agencies can view team members" ON public.profiles
  FOR SELECT
  USING (auth.uid() = parent_agency_id);

DROP POLICY IF EXISTS "Agencies can view attached clients" ON public.profiles;
CREATE POLICY "Agencies can view attached clients" ON public.profiles
  FOR SELECT
  USING (auth.uid() = parent_agency_id AND role = 'CLIENT');

-- 4. INVOICES: Read Own
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT
  USING (auth.uid() = tenant_id);

-- 5. Grant Usage on Schema (Just in case)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

SELECT 'Permissões corrigidas com sucesso!' as status;`,
        icon: <Shield className="w-4 h-4 text-blue-500" />,
        category: 'setup'
    },
    {
        id: 'list-users',
        title: 'Listar Usuários',
        query: 'SELECT id, email, created_at FROM auth.users LIMIT 10',
        icon: <List className="w-4 h-4" />,
        category: 'utility'
    },
    {
        id: 'count-by-role',
        title: 'Contar Usuários por Cargo',
        query: 'SELECT role, count(*) FROM auth.users GROUP BY role',
        icon: <Code className="w-4 h-4" />,
        category: 'utility'
    },
    {
        id: 'system-settings',
        title: 'Ver Configurações',
        query: 'SELECT * FROM information_schema.tables WHERE table_schema = \'public\'',
        icon: <Database className="w-4 h-4" />,
        category: 'utility'
    },
    {
        id: 'setup-vault-v2',
        title: '[SISTEMA] Setup Cofre de Senhas (Vault V2)',
        query: `-- COFRE DE SENHAS (VAULT)
-- Tabela para armazenar chaves de API sensíveis (Stripe, Asaas, etc)

CREATE TABLE IF NOT EXISTS public.vault_secrets (
    id uuid default gen_random_uuid() primary key,
    provider text not null, -- 'asaas', 'stripe', 'kiwify', 'hotmart'
    key_type text not null, -- 'api_key', 'webhook_secret', etc.
    value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint vault_secrets_provider_key_unique unique (provider, key_type)
);

-- Habilitar RLS
ALTER TABLE public.vault_secrets ENABLE ROW LEVEL SECURITY;

-- Política de Acesso (Master/Admin)
-- Permite que usuários autenticados acessem. Em produção, refinar para 'role = master'.
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.vault_secrets;
CREATE POLICY "Enable all access for authenticated users" 
ON public.vault_secrets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Garantir tabela master_config e coluna active_gateway
CREATE TABLE IF NOT EXISTS public.master_config (
    id uuid default gen_random_uuid() primary key,
    trigger_days_before integer default 3,
    message_title text default 'Sua assinatura vai vencer',
    message_body text default 'Regularize para não perder o acesso.',
    is_active boolean default true,
    channels jsonb default '{"email": true, "whatsapp": false, "popup": true}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active_gateway text default 'asaas'
);

-- Adicionar active_gateway se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_config' AND column_name = 'active_gateway') THEN
        ALTER TABLE public.master_config ADD COLUMN active_gateway text DEFAULT 'asaas';
    END IF;
END $$;

-- Habilitar RLS para master_config
ALTER TABLE public.master_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Config" ON public.master_config;
CREATE POLICY "Public Read Config" ON public.master_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Master Update Config" ON public.master_config;
CREATE POLICY "Master Update Config" ON public.master_config FOR UPDATE USING (true) WITH CHECK (true);

SELECT 'Cofre (Vault) e Configurações atualizados com sucesso!' as status;`,
        icon: <ShieldCheck className="w-4 h-4 text-purple-500" />,
        category: 'setup'
    },
    /*{
        id: 'setup-invoices-v1',
        title: '[FINANCEIRO] Setup Tabela Faturas & Gateway',
        query: `-- PROMPT TÉCNICO: SETUP FINANCEIRO ... (omitted for brevity)`,
        icon: <Receipt className="w-4 h-4 text-green-500" />,
        category: 'setup'
    },*/
    {
        id: 'fix-subscriptions-constraint',
        title: '[SISTEMA] Corrigir Tabela Assinaturas (Unique Constraint)',
        query: `-- Add UNIQUE constraint to tenant_id on subscriptions table
-- This allows ON CONFLICT (tenant_id) to work for Upserts

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'subscriptions_tenant_id_key'
    ) THEN
        ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_tenant_id_key UNIQUE (tenant_id);
    END IF;
END $$;

SELECT 'Constraint de unicidade adicionada com sucesso!' as status;`,
        icon: <Shield className="w-4 h-4 text-orange-500" />,
        category: 'setup'
    },
    {
        id: 'deploy-master',
        title: '[CRÍTICO] Deploy Master Suite v1.1 (Safe)',
        query: `
DO $$
BEGIN
    -- 1. Plans Table
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
        CREATE TABLE public.plans (
            id uuid default gen_random_uuid() primary key,
            name text not null,
            price decimal(10,2) not null,
            period text check (period in ('monthly', 'yearly')),
            features jsonb default '[]'::jsonb,
            max_users int default 1,
            max_connections int default 1,
            is_active boolean default true,
            created_at timestamp with time zone default timezone('utc'::text, now())
        );
        ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public Read Plans" on public.plans for select using (true);
        CREATE POLICY "Master Write Plans" on public.plans for insert with check (true);
        
        -- Seed Plans
        INSERT INTO public.plans (name, price, period, max_users, max_connections, features) VALUES
        ('Uniafy Starter', 297.00, 'monthly', 3, 1, '["Gestão de Leads"]'),
        ('Uniafy Growth', 597.00, 'monthly', 10, 5, '["G-Hunter", "Automação"]'),
        ('Uniafy Black', 997.00, 'monthly', 999, 999, '["Ilimitado"]');
    END IF;

    -- 2. Subscriptions Table
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
        CREATE TABLE public.subscriptions (
            id uuid default gen_random_uuid() primary key,
            tenant_id uuid not null,
            plan_id uuid references public.plans(id),
            status text check (status in ('active', 'past_due', 'canceled', 'trial')),
            start_date timestamp with time zone default now(),
            next_billing_date timestamp with time zone,
            amount decimal(10,2),
            payment_method text,
            created_at timestamp with time zone default timezone('utc'::text, now())
        );
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Agency Read Own Sub" on public.subscriptions for select using (true);
    END IF;

    -- 3. Master Global Config
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'master_config') THEN
        CREATE TABLE public.master_config (
            id uuid default gen_random_uuid() primary key,
            trigger_days_before int default 3,
            message_title text default 'Atenção Master',
            message_body text default 'Sua licença expira em breve.',
            is_active boolean default true,
            channels jsonb default '{"popup": true, "email": true}'::jsonb,
            updated_at timestamp with time zone default now()
        );
        ALTER TABLE public.master_config ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public Read Config" on public.master_config for select using (true);
        
        -- Seed Config
        INSERT INTO public.master_config (trigger_days_before, message_title, is_active) VALUES
        (3, 'Renove sua Licença', true);
    END IF;

END $$;
        `,
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        category: 'setup'
    },
    {
        id: 'debug-rpc',
        title: '[DEBUG] Ver Definição do RPC',
        query: "SELECT pg_get_functiondef('admin_exec_sql'::regproc)",
        icon: <Code className="w-4 h-4 text-blue-500" />,
        category: 'utility'
    },
    {
        id: 'setup-trial-user',
        title: '[SETUP] Criar Assinatura Trial (User Atual)',
        query: `
-- Primeiro remove qualquer assinatura anterior para evitar duplicidade
DELETE FROM public.subscriptions WHERE tenant_id = auth.uid();

-- Insere nova assinatura TRIAL expirando em 3 dias
INSERT INTO public.subscriptions (
  tenant_id,
  plan_id,
  status,
  start_date,
  next_billing_date,
  amount,
  payment_method
)
SELECT 
  auth.uid(),
  (SELECT id FROM public.plans WHERE name = 'Uniafy Growth' LIMIT 1),
  'trial',
  now(),
  now() + interval '3 days',
  0.00,
  'CC'
FROM auth.users WHERE id = auth.uid();

SELECT 'Assinatura TRIAL criada com sucesso para o usuário atual.' as status;
`,
        icon: <CheckCircle2 className="w-4 h-4 text-orange-500" />,
        category: 'setup'
    },
    {
        id: 'setup-agency-v1',
        title: '[MIGRAÇÃO] Setup Agência e Trial (Safe Mode)',
        query: `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'client' CHECK (role IN ('owner', 'agency', 'client'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_start_date timestamp with time zone DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS parent_agency_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_domain text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branding_logo text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branding_colors jsonb DEFAULT '{"primary": "#F97316", "secondary": "#000000"}'::jsonb;
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $fn$ BEGIN INSERT INTO public.profiles (id, email, full_name, role, trial_start_date, subscription_status) VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'role', 'client'), NOW(), 'trial'); RETURN new; END; $fn$ LANGUAGE plpgsql SECURITY DEFINER;
SELECT 'Migração Safe Mode Concluída: Colunas criadas e Função atualizada.' as status;`,
        icon: <Database className="w-4 h-4 text-emerald-500" />,
        category: 'setup'
    },
    {
        id: 'fix-master-update',
        title: '[FIX] Permitir Edição Master Config',
        query: `
-- Cria política para permitir UPDATE na tabela master_config
-- Isso resolve o problema de "Salvamento Fake" no painel Master
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'master_config' 
        AND policyname = 'Master Update Config'
    ) THEN
        CREATE POLICY "Master Update Config" 
        ON public.master_config 
        FOR UPDATE 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;

SELECT 'Política de UPDATE criada com sucesso para master_config.' as status;
`,
        icon: <CheckCircle2 className="w-4 h-4 text-yellow-500" />,
        category: 'setup'
    },
    {
        id: 'setup-plans-v2',
        title: '[MIGRAÇÃO] Setup Planos V2 (Uniafy Removed)',
        query: `
-- 1. Limpar tabela antiga se existir
DROP TABLE IF EXISTS plans CASCADE;

-- 2. Criar tabela com nova estrutura
CREATE TABLE plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    monthly_price_id TEXT NOT NULL,
    yearly_price_id TEXT NOT NULL,
    monthly_price_amount NUMERIC(10, 2) DEFAULT 0,
    yearly_price_amount NUMERIC(10, 2) DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    period TEXT DEFAULT 'monthly',
    max_users INTEGER DEFAULT 1,
    max_connections INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inserir Plans Oficiais (Sem prefixo Uniafy)
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
        'Enterprise',
        'Soluções customizadas (Sob Consulta)',
        'enterprise_monthly',
        'enterprise_yearly',
        0.00,
        0.00,
        '["Infraestrutura Dedicada", "SLA Garantido", "Gestor de Conta"]'::jsonb,
        9999,
        9999,
        true
    ),
    (
        'plan_master',
        'Master System',
        'Acesso administrativo total',
        'master_monthly',
        'master_yearly',
        0.00,
        0.00,
        '["God Mode"]'::jsonb,
        99999,
        99999,
        true
    );

-- 4. Criar Policies RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Plans" ON plans FOR SELECT USING (true);

-- Permissão para Cristiano (Master)
CREATE POLICY "Admin Manage Plans" ON plans FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

SELECT 'Migração Planos V2 concluída com sucesso!' as status;
`,
        icon: <Database className="w-4 h-4 text-purple-500" />,
        category: 'setup'
    },
    {
        id: 'setup_subscriptions_v1',
        title: '[MIGRAÇÃO] Setup Assinaturas & Tenants (Beta)',
        query: `-- SCRIPT DE INFRAESTRUTURA: TENANTS & SUBSCRIPTIONS (V1)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    company_name TEXT,
    document TEXT,
    phone TEXT,
    role TEXT DEFAULT 'AGENCY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GARANTIR COLUNAS (UPDATE SEGURO)
DO $$
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'AGENCY';
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT REFERENCES public.plans(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'PIX',
    next_billing_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies Simple (Master Email Hardcoded for speed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles View Self or Master') THEN
        CREATE POLICY "Profiles View Self or Master" ON public.profiles FOR SELECT
        USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));
    END IF;

     IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Subs View Self or Master') THEN
        CREATE POLICY "Subs View Self or Master" ON public.subscriptions FOR SELECT
        USING (auth.uid() = tenant_id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));
    END IF;
END $$;

SELECT 'Tabelas profiles e subscriptions configuradas com sucesso!' as status;`,
        icon: <Users className="w-4 h-4 text-blue-500" />,
        category: 'setup'
    },
    {
        id: 'seed-fake-data-v1',
        title: '[SEED] Popular Dados de Teste (Reset & Fix)',
        query: `-- SEED RESET: Recria tabela de subscriptions com FK correta e ajusta permissoes
-- 1. Reset da Tabela Subscriptions
DROP TABLE IF EXISTS public.subscriptions;

CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT NOT NULL REFERENCES public.plans(id), -- Correção Critical: FK para permitir Joins
    status TEXT NOT NULL DEFAULT 'active',
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'PIX',
    next_billing_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Configurar Segurança (RLS e Grants)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subs View Self or Master" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Subs All Master" ON public.subscriptions FOR ALL USING (true);

-- Permissões Explicitas (Para resolver 'permission denied')
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.plans TO authenticated;

-- 3. Relaxar Restrições do Profile (Para inserir Agências Fakes)
DO $$ BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 4. Inserir Agências Fakes
INSERT INTO public.profiles (id, email, company_name, role) VALUES 
('d0000000-0000-0000-0000-000000000001', 'agencia.alpha@test.com', 'Agência Alpha', 'AGENCY'),
('d0000000-0000-0000-0000-000000000002', 'beta.marketing@test.com', 'Beta Marketing', 'AGENCY'),
('d0000000-0000-0000-0000-000000000003', 'charlie.growth@test.com', 'Charlie Growth', 'AGENCY')
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir Assinaturas (Com IDs de Planos Válidos)
INSERT INTO public.subscriptions (tenant_id, plan_id, status, amount, next_billing_date, payment_method) VALUES
('d0000000-0000-0000-0000-000000000001', 'plan_scale', 'active', 597.00, NOW() + INTERVAL '15 days', 'CC'),
('d0000000-0000-0000-0000-000000000002', 'plan_essential', 'past_due', 297.00, NOW() - INTERVAL '3 days', 'PIX'),
('d0000000-0000-0000-0000-000000000003', 'plan_black', 'active', 997.00, NOW() + INTERVAL '28 days', 'BOLETO');

SELECT 'SUCESSO: Schema corrigido, permissoes concedidas e dados inseridos.' as status;`,
        icon: <Users className="w-4 h-4 text-green-500" />,
        category: 'setup'
    },
    {
        id: 'setup-profiles-v2',
        title: '[MIGRAÇÃO] Setup Profiles V2 (Trial & WL)',
        query: `-- setup_profiles_v2.sql
-- Objetivo: Atualizar tabela profiles para suportar Trial e White Label
-- Criado em: 2026-01-17

-- 1. Adicionar colunas para Controle de Trial e Assinatura
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing';

-- 2. Adicionar colunas para White Label (Agência)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS branding_logo TEXT,
ADD COLUMN IF NOT EXISTS branding_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}'::jsonb;

-- 3. Atualizar a função handle_new_user para inicializar Trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    created_at, 
    updated_at,
    trial_start_date, -- Inicializa o Trial
    subscription_status -- Define status inicial
  )
  VALUES (
    new.id, 
    new.email, 
    'user', -- Role padrão (pode ser ajustado)
    NOW(), 
    NOW(),
    NOW(), -- Trial começa agora
    'trialing' -- Status de teste
  );
  RETURN new;
END;
$function$;

SELECT 'Setup Profiles V2 (Trial & WL) concluído com sucesso!' as status;`,
        icon: <Users className="w-4 h-4 text-pink-500" />,
        category: 'setup'
    },
    {
        id: 'setup-multigateway-v1',
        title: '[SISTEMA] Setup Multi-Gateway (Active Switch)',
        query: `-- Add 'active_gateway' to master_config
ALTER TABLE public.master_config 
ADD COLUMN IF NOT EXISTS active_gateway TEXT DEFAULT 'asaas';

-- Update existing config to have a default if null
UPDATE public.master_config 
SET active_gateway = 'asaas' 
WHERE active_gateway IS NULL;

SELECT 'Suporte a Multi-Gateway ativado com sucesso!' as status;`,
        icon: <Key className="w-4 h-4 text-cyan-500" />,
        category: 'setup'
    },
    {
        id: 'setup-checkout-security',
        title: '[SEGURANÇA] Setup Checkout & CPF',
        query: `-- Adicionar campos de segurança e pagamento ao Profile
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS gateway_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_token TEXT;

-- Garantir unicidade do CPF (evitar duplicatas)
-- Primeiro, limpa CPFs vazios se existirem para evitar erro de constraint (opcional, segurança)
UPDATE public.profiles SET cpf = NULL WHERE cpf = '';

-- Adiciona a constraint UNIQUE apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_cpf_key') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_cpf_key UNIQUE (cpf);
    END IF;
END $$;

SELECT 'Campos de CPF e Pagamento criados com sucesso!' as status;`,
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
        category: 'setup'
    },
    {
        id: 'sync-kiwify-plans',
        title: '[PRODUTOS] Sincronizar Planos Reais (Kiwify)',
        query: `-- SYNC PLANOS KIWIFY & UNIAFY
-- Objetivo: Garantir que a tabela plans reflita exatamente os produtos cadastrados na Kiwify

-- 1. Garantir Colunas de ID Externo
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS gateway_id_monthly TEXT;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS gateway_id_yearly TEXT;

-- 2. Atualizar Planos (Upsert)
INSERT INTO public.plans (
    id, name, description, 
    monthly_price_amount, yearly_price_amount, 
    monthly_price_id, yearly_price_id,
    features, max_users, max_connections, is_active
) VALUES
    (
        'plan_essential',
        'Uniafy Essential',
        'Para Gestores Solo iniciando a jornada',
        297.00,
        2970.00,
        'essential_monthly',
        'essential_yearly',
        '["Gestão de Leads", "CRM Básico", "Até 3 Usuários", "Sem White Label"]'::jsonb,
        3,
        1,
        true
    ),
    (
        'plan_scale',
        'Uniafy Scale',
        'Para Agências em crescimento',
        597.00,
        5970.00,
        'scale_monthly',
        'scale_yearly',
        '["White Label", "Até 10 Usuários", "Squads", "G-Hunter", "Automação N8N"]'::jsonb,
        10,
        5,
        true
    ),
    (
        'plan_black',
        'Uniafy Black',
        'Para Grandes Operações',
        997.00,
        9970.00,
        'black_monthly',
        'black_yearly',
        '["Tudo Ilimitado", "IA Avançada", "Suporte Dedicado", "N8N Integrado", "Prioridade"]'::jsonb,
        999,
        999,
        true
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    monthly_price_amount = EXCLUDED.monthly_price_amount,
    yearly_price_amount = EXCLUDED.yearly_price_amount,
    features = EXCLUDED.features,
    max_users = EXCLUDED.max_users,
    updated_at = now();

SELECT 'Planos sincronizados com os preços da Kiwify com sucesso!' as status;`,
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
        category: 'setup'
    },
    {
        id: 'setup-multi-gateway-columns',
        title: '[ESTRUTURA] Criar Colunas Multi-Gateway',
        query: `-- Adicionar colunas específicas para cada Gateway (Mensal e Anual)
ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS kiwify_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS kiwify_id_yearly TEXT,

ADD COLUMN IF NOT EXISTS stripe_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS stripe_id_yearly TEXT,

ADD COLUMN IF NOT EXISTS asaas_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS asaas_id_yearly TEXT,

ADD COLUMN IF NOT EXISTS hotmart_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS hotmart_id_yearly TEXT;

-- Migrar dados antigos (se houver) para Kiwify (Assumindo Kiwify como padrão anterior)
UPDATE public.plans 
SET 
    kiwify_id_monthly = gateway_id_monthly, 
    kiwify_id_yearly = gateway_id_yearly
WHERE 
    kiwify_id_monthly IS NULL 
    AND gateway_id_monthly IS NOT NULL;

SELECT 'Estrutura Multi-Gateway criada com sucesso!' as status;`,
        icon: <Database className="w-4 h-4 text-blue-500" />,
        category: 'setup'
    },
    {
        id: 'setup-visual-customization',
        title: '[ESTRUTURA] Colunas Visuais (Ícone/Cor)',
        query: `-- Adicionar colunas de customização visual
ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS icon_key TEXT DEFAULT 'Zap',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#FF6600';

-- Definir padrões iniciais baseados nos planos existentes
UPDATE public.plans SET icon_key = 'Zap', accent_color = '#3B82F6' WHERE id LIKE '%essential%'; -- Azul
UPDATE public.plans SET icon_key = 'Globe', accent_color = '#F97316' WHERE id LIKE '%scale%'; -- Laranja
UPDATE public.plans SET icon_key = 'Star', accent_color = '#A855F7' WHERE id LIKE '%black%'; -- Roxo
UPDATE public.plans SET icon_key = 'Shield', accent_color = '#EF4444' WHERE id LIKE '%enterprise%'; -- Vermelho

SELECT 'Colunas visuais criadas e configuradas com sucesso!' as status;`,
        icon: <Zap className="w-4 h-4 text-purple-500" />,
        category: 'setup'
    },
    {
        id: 'setup-branding-v1',
        title: '[ESTRUTURA] Setup Identidade Visual (Branding)',
        query: `-- Adicionar coluna JSONB para Branding Global
ALTER TABLE public.master_config
ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{"colors": {"primary": "24 100% 52%", "background": "240 10% 2%", "sidebar": "0 0% 2%"}, "logo_url": ""}'::jsonb;

SELECT 'Coluna de Branding criada com sucesso em master_config!' as status;`,
        icon: <Palette className="w-4 h-4 text-pink-500" />,
        category: 'setup'
    },
    {
        id: 'fix-storage-permissions',
        title: '[STORAGE] Corrigir Permissões de Upload & Imagens',
        query: `-- SCRIPT PARA CORRIGIR PERMISSÕES DE STORAGE - UNIAFY
-- Este script garante que o bucket 'Identidade Visual' exista e que as permissões de upload estejam corretas.

-- 1. Garante que o bucket 'Identidade Visual' exista e seja público
INSERT INTO storage.buckets (id, name, public)
VALUES ('Identidade Visual', 'Identidade Visual', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Limpa políticas existentes para evitar duplicidade
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Master Upload" ON storage.objects;
DROP POLICY IF EXISTS "Master Update" ON storage.objects;
DROP POLICY IF EXISTS "Master Delete" ON storage.objects;

-- 3. Cria novas políticas de acesso total para o bucket 'Identidade Visual'
-- Estas políticas garantem que usuários autenticados possam Ver, Inserir, Atualizar e Deletar
-- O DELETE é essencial para a substituição automática de imagens (branding-uploader).

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO authenticated, anon
USING (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Upload" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Update" 
ON storage.objects FOR UPDATE 
TO authenticated
WITH CHECK (bucket_id = 'Identidade Visual');

CREATE POLICY "Master Delete" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'Identidade Visual');

-- Habilitar RLS se não estiver
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

SELECT 'Permissões de Storage configuradas com sucesso! Substituição de imagens ativada.' as status;`,
        icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />,
        category: 'setup'
    },
    {
        id: 'fix-clients-rls',
        title: '[FIX] Corrigir Lista de Clientes (RLS)',
        query: `-- 1. CORREÇÃO DE RLS (Permitir ver clientes)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agencies can view attached clients" ON public.profiles;

CREATE POLICY "Agencies can view attached clients"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = parent_agency_id  -- A agência pode ver quem ela é "pai"
  OR 
  auth.uid() = id -- O próprio usuário pode se ver
);

-- 2. INSERIR CLIENTE DE TESTE (Vinculado a você)
DO $$
DECLARE
  v_master_id uuid;
BEGIN
  SELECT id INTO v_master_id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com' LIMIT 1;

  IF v_master_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role, parent_agency_id, company_name)
    VALUES (
      gen_random_uuid(), 
      'cliente.teste@exemplo.com', 
      'Cliente Teste',
      'client',
      v_master_id, 
      'Minha Primeira Loja'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

SELECT 'Permissões corrigidas e cliente teste criado!' as status;`,
        icon: <Shield className="w-4 h-4 text-red-500" />,
        category: 'utility'
    },
    {
        id: 'util-check-cpf',
        title: '[UTIL] Função Check CPF Disponível',
        query: `-- Função segura para frontend verificar se CPF já existe (sem expor dados)
CREATE OR REPLACE FUNCTION public.check_cpf_available(cpf_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Roda como admin para poder checar toda a base
SET search_path = ''
AS $$
DECLARE
  exists_cpf boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE cpf = cpf_check
  ) INTO exists_cpf;
  
  RETURN NOT exists_cpf; -- Retorna TRUE se estiver disponível (não existe)
END;
$$;

-- Liberar acesso para público (anon) e logado (authenticated)
GRANT EXECUTE ON FUNCTION public.check_cpf_available(text) TO anon, authenticated;

SELECT 'Função check_cpf_available criada com sucesso!' as status;`,
        icon: <ShieldCheck className="w-4 h-4 text-zinc-500" />,
        category: 'utility'
    },
    {
        id: 'setup-reports-dashboards-v1',
        title: '[NOVO] Setup Relatórios & Public Dashboards',
        query: `-- Tabela para Automações de Relatórios (N8n)
CREATE TABLE IF NOT EXISTS public.report_automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'manual')),
  payload_config JSONB DEFAULT '{}'::jsonb,
  last_run_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela para Dashboards Públicos (Reportei-style)
CREATE TABLE IF NOT EXISTS public.public_dashboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Opcional: vincula a um cliente específico (que é um user/profile)
  share_token TEXT NOT NULL UNIQUE,
  config_json JSONB DEFAULT '{}'::jsonb, -- Configuração de quais gráficos exibir
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Apenas a própria agência pode ver/editar suas automações
ALTER TABLE public.report_automations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agencies can manage their own report automations" ON public.report_automations;
CREATE POLICY "Agencies can manage their own report automations"
ON public.report_automations
FOR ALL
USING (auth.uid() = agency_id);

-- RLS: Public Dashboards
ALTER TABLE public.public_dashboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agencies can manage their own public dashboards" ON public.public_dashboards;
CREATE POLICY "Agencies can manage their own public dashboards"
ON public.public_dashboards
FOR ALL
USING (auth.uid() = agency_id);

-- Índices e RPC
CREATE INDEX IF NOT EXISTS idx_report_automations_agency ON public.report_automations(agency_id);
CREATE INDEX IF NOT EXISTS idx_public_dashboards_token ON public.public_dashboards(share_token);

CREATE OR REPLACE FUNCTION get_public_dashboard_by_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Executa como admin para bypassar RLS
AS $$
DECLARE
  v_dashboard RECORD;
  v_branding RECORD;
BEGIN
  -- Buscar o dashboard
  SELECT * INTO v_dashboard
  FROM public.public_dashboards
  WHERE share_token = p_token
  AND (expires_at IS NULL OR expires_at > now());

  IF v_dashboard.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Incrementar contador de views
  UPDATE public.public_dashboards SET views_count = views_count + 1 WHERE id = v_dashboard.id;

  -- Buscar Branding da Agência
  SELECT company_name, branding_logo, branding_colors 
  INTO v_branding
  FROM public.profiles
  WHERE id = v_dashboard.agency_id;

  -- Retornar combinação
  RETURN jsonb_build_object(
    'dashboard', row_to_json(v_dashboard),
    'agency', row_to_json(v_branding)
  );
END;
$$;

SELECT 'Configuração de Reports e Dashboards concluída com sucesso!' as status;`,
        icon: <Users className="w-4 h-4 text-cyan-500" />,
        category: 'setup'
    },
    {
        id: 'fix-plans-names-v1',
        title: '[MIGRAÇÃO] Corrigir Nomes Planos (Master/Enterprise)',
        query: `-- Fix Plans Names: Separate Master from Enterprise
        
-- 1. Create a specific Master Plan (Hidden/System)
INSERT INTO public.plans (
    id, name, description, 
    monthly_price_id, yearly_price_id, 
    monthly_price_amount, yearly_price_amount, 
    features, max_users, max_connections, is_active
) VALUES (
    'plan_master',
    'Master System',
    'Acesso administrativo total',
    'master_monthly',
    'master_yearly',
    0.00,
    0.00,
    '["God Mode"]'::jsonb,
    99999,
    99999,
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Update Enterprise Plan to be Commercial (Remove Master reference)
UPDATE public.plans 
SET 
    name = 'Enterprise', 
    description = 'Soluções customizadas (Sob Consulta)'
WHERE id = 'plan_enterprise';

SELECT 'Planos corrigidos: Master separado do Enterprise!' as status;`,
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
        category: 'setup'
    },
    {
        id: 'migration-add-is-visible',
        title: '[MIGRAÇÃO] Adicionar Coluna Visibilidade',
        query: `-- Add is_visible column to plans table
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Update existing plans to be visible by default
UPDATE public.plans SET is_visible = true WHERE is_visible IS NULL;

SELECT 'Coluna is_visible adicionada com sucesso!' as status;`,
        icon: <Zap className="w-4 h-4 text-orange-500" />,
        category: 'setup'
    }
];

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Archive } from 'lucide-react';

export default function SqlBank() {
    const [query, setQuery] = useState('');
    const [presetTitle, setPresetTitle] = useState<string | null>(null);
    const [results, setResults] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastExecuted, setLastExecuted] = useState<Date | null>(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Persist hidden presets
    const [hiddenPresets, setHiddenPresets] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('uniafy_hidden_sql_presets');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const filteredPresets = PRESETS.filter(p =>
        (!searchTerm ||
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.query.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !hiddenPresets.includes(p.id)
    );

    const hidePreset = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (hiddenPresets.includes(id)) return;

        const newHidden = [...hiddenPresets, id];
        setHiddenPresets(newHidden);
        localStorage.setItem('uniafy_hidden_sql_presets', JSON.stringify(newHidden));
        toast.success("Preset arquivado.");
    };

    const restorePreset = (id: string) => {
        const newHidden = hiddenPresets.filter(p => p !== id);
        setHiddenPresets(newHidden);
        localStorage.setItem('uniafy_hidden_sql_presets', JSON.stringify(newHidden));
        toast.success("Preset restaurado para a lista.");
    };

    const archiveSetupPresets = () => {
        const setupPresetIds = PRESETS
            .filter(p => p.category === 'setup')
            .map(p => p.id);

        const newHidden = Array.from(new Set([...hiddenPresets, ...setupPresetIds]));

        setHiddenPresets(newHidden);
        localStorage.setItem('uniafy_hidden_sql_presets', JSON.stringify(newHidden));
        toast.success(`${setupPresetIds.length} scripts de instalação foram arquivados.`);
    };

    const handleRunQuery = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const { data, error: rpcError } = await supabase.rpc('admin_exec_sql', {
                sql_query: query
            });

            if (rpcError) {
                setError(rpcError.message);
                toast.error('Erro na execução da query');
            } else if (data && data.error) {
                setError(data.error);
                toast.error('Erro retornado pelo banco');
            } else {
                setResults(data);
                setLastExecuted(new Date());
                toast.success(`Query executada com sucesso! (${data?.length || 0} resultados)`);
            }
        } catch (err: any) {
            setError(err.message || 'Erro inesperado ao conectar ao Supabase');
        } finally {
            setLoading(false);
        }
    };

    const clearQuery = () => {
        setQuery('');
        setPresetTitle(null);
        setResults(null);
        setError(null);
        setLastExecuted(null);
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="BANCO SQL"
                titleAccent="INDUSTRIAL"
                subtitle="V6.1 Master • Execução direta de comandos"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Editor Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card-industrial p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground mr-4">Editor de Query SQL</span>
                                {presetTitle && (
                                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                        {presetTitle}
                                    </span>
                                )}
                            </div>
                            {lastExecuted && (
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground lowercase italic">
                                    <Clock className="w-3 h-3" />
                                    última execução: {lastExecuted.toLocaleTimeString()}
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-lg" />
                            <Textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SELECT * FROM table..."
                                className="min-h-[280px] font-mono text-sm bg-black/60 border-white/5 focus:border-primary/50 text-foreground/90 p-4 resize-none relative z-10"
                            />
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearQuery}
                                className="h-9 border-white/5 bg-white/5 text-[10px] uppercase font-bold text-muted-foreground hover:text-white"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Limpar
                            </Button>
                            <Button
                                onClick={handleRunQuery}
                                disabled={loading || !query}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider h-11 px-8 gap-2 group shadow-lg shadow-primary/20"
                            >
                                {loading ? (
                                    'Processando...'
                                ) : (
                                    <>
                                        Executar Query
                                        <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <AnimatePresence mode="wait">
                        {(results || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="card-industrial overflow-hidden border-white/5"
                            >
                                <div className="p-4 bg-muted/30 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                                        Saída de Dados
                                    </span>
                                    {error ? (
                                        <XCircle className="w-4 h-4 text-destructive" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    )}
                                </div>

                                {error ? (
                                    <div className="p-6 bg-destructive/10 text-destructive font-mono text-sm border-l-2 border-destructive">
                                        <div className="flex gap-2 items-start">
                                            <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
                                            <pre className="whitespace-pre-wrap">{error}</pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto max-h-[400px]">
                                        {results && results.length > 0 ? (
                                            <table className="w-full text-left text-sm font-mono whitespace-nowrap">
                                                <thead>
                                                    <tr className="bg-white/5">
                                                        {Object.keys(results[0]).map((key) => (
                                                            <th key={key} className="px-4 py-3 text-[10px] uppercase font-bold text-muted-foreground border-b border-white/5">
                                                                {key}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {results.map((row, i) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                                            {Object.values(row).map((val: any, j) => (
                                                                <td key={j} className="px-4 py-3 text-foreground/80 border-b border-white/5">
                                                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="p-12 text-center text-muted-foreground italic">
                                                A query não retornou resultados ou foi um comando de modificação.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lateral of Presets */}
                <div className="lg:col-span-4 gap-6">
                    <div className="card-industrial p-6 sticky top-8 max-h-[calc(100vh-100px)] flex flex-col">
                        <div className="space-y-4 mb-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    Presets Disponíveis
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={archiveSetupPresets}
                                        className="h-6 px-2 text-[10px] text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 border border-orange-500/20"
                                        title="Auto-Ocultar todos os scripts de Setup/Migração já instalados"
                                    >
                                        <Archive className="w-3 h-3 mr-1" />
                                        Limpar Setups
                                    </Button>

                                    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-6 px-2 text-[10px] text-muted-foreground hover:text-white border border-white/10 hover:bg-white/5 ${hiddenPresets.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                Arquivados ({hiddenPresets.length})
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                                    <Archive className="w-5 h-5 text-primary" />
                                                    Gerenciar Arquivados
                                                </DialogTitle>
                                                <DialogDescription className="text-muted-foreground">
                                                    Estes scripts foram ocultados da sua lista principal. Restaure-os se precisar executá-los novamente.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <ScrollArea className="max-h-[300px] mt-4 pr-4">
                                                {hiddenPresets.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                                                        Nenhum preset arquivado.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {PRESETS.filter(p => hiddenPresets.includes(p.id)).map(preset => (
                                                            <div key={preset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                                                <div className="flex items-start gap-3 overflow-hidden">
                                                                    <div className="mt-1 p-1.5 rounded bg-background/50 border border-white/5 text-muted-foreground">
                                                                        {preset.icon}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-medium text-white truncate">{preset.title}</p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <Badge variant="outline" className="text-[10px] h-4 border-white/10 text-muted-foreground uppercase">
                                                                                {preset.category === 'setup' ? 'Instalação' : 'Utilidade'}
                                                                            </Badge>
                                                                            <span className="text-[10px] text-muted-foreground truncate opacity-50 font-mono">
                                                                                {preset.id}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => restorePreset(preset.id)}
                                                                    className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                                                    title="Restaurar para a lista"
                                                                >
                                                                    <RefreshCw className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>

                                            <DialogFooter className="mt-4 border-t border-white/5 pt-4">
                                                <Button
                                                    variant="secondary"
                                                    className="w-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                                                    onClick={() => setIsManageModalOpen(false)}
                                                >
                                                    Fechar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            {/* SEARCH INPUT */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar preset (nome ou sql)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 font-medium overflow-y-auto pr-2 custom-scrollbar flex-1 -mr-2">
                            {filteredPresets.map((preset) => (
                                <div key={preset.id} className="relative group/item">
                                    <button
                                        onClick={() => {
                                            setQuery(preset.query);
                                            setPresetTitle(preset.title);
                                        }}
                                        className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group flex items-start gap-4"
                                    >
                                        <div className="mt-1 p-2 rounded bg-background border border-white/5 group-hover:text-primary transition-colors flex-shrink-0">
                                            {preset.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground/90 group-hover:text-primary transition-colors truncate">{preset.title}</p>
                                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 font-mono uppercase">
                                                {preset.query}
                                            </p>
                                        </div>
                                    </button>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10 flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => hidePreset(preset.id, e)}
                                            className="h-6 w-6 bg-black/50 hover:bg-destructive hover:text-white border border-white/10"
                                            title="Limpar este preset da lista (Ocultar)"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
                            <div className="flex gap-2 text-orange-500">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed uppercase font-bold tracking-tight">
                                    Dica: Use o ícone de lixeira para limpar presets desnecessários da sua visualização.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
