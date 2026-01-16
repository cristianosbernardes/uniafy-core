-- SCRIPT DE INFRAESTRUTURA: TENANTS & SUBSCRIPTIONS (V1)
-- Dependências: Tabela 'plans' já deve existir

-- 1. Tabela de Tenants (Perfis de Agências)
-- Estende a auth.users, mas foca na entidade "Negócio"
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT, -- Nome da pessoa ou fantasia
    email TEXT,
    company_name TEXT, -- Nome da Agência
    document TEXT, -- CNPJ/CPF
    phone TEXT,
    role TEXT DEFAULT 'AGENCY', -- AGENCY, ADMIN, MASTER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Assinaturas (Subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT REFERENCES public.plans(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, past_due, canceled, trial
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'PIX', -- PIX, CC, BOLETO
    next_billing_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Básicas com God Mode)

-- Profiles: Leitura (self or master)
CREATE POLICY "Profiles View Self or Master" ON public.profiles FOR SELECT
USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

-- Profiles: Update (Self or Master)
CREATE POLICY "Profiles Update Self or Master" ON public.profiles FOR UPDATE
USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

-- Subscriptions: Leitura (Self or Master)
CREATE POLICY "Subs View Self or Master" ON public.subscriptions FOR SELECT
USING (auth.uid() = tenant_id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

-- Subscriptions: Apenas Master pode CRIAR/EDITAR (via API ou Painel)
CREATE POLICY "Master Manage Subs" ON public.subscriptions FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

-- 5. Inserir Dados Mocks (Fake Clients) para Teste Real
-- Obs: Precisamos de UUIDs validos da auth.users se formos rigorosos, 
-- mas para teste de visualização na query, podemos desabilitar a FK temporariamente ou assumir que o sistema permite.
-- NÃO execute inserção direta se não tiver certeza dos IDs da auth.
