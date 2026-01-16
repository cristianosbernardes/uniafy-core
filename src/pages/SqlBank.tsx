import { useState } from 'react';
import { Database, Play, Trash2, List, Code, AlertTriangle, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
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
}

const PRESETS: Preset[] = [
    {
        id: 'list-users',
        title: 'Listar Usuários',
        query: 'SELECT id, email, created_at FROM auth.users LIMIT 10',
        icon: <List className="w-4 h-4" />
    },
    {
        id: 'count-by-role',
        title: 'Contar Usuários por Cargo',
        query: 'SELECT role, count(*) FROM auth.users GROUP BY role',
        icon: <Code className="w-4 h-4" />
    },
    {
        id: 'system-settings',
        title: 'Ver Configurações',
        query: 'SELECT * FROM information_schema.tables WHERE table_schema = \'public\'',
        icon: <Database className="w-4 h-4" />
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
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
    },
    {
        id: 'debug-rpc',
        title: '[DEBUG] Ver Definição do RPC',
        query: "SELECT pg_get_functiondef('admin_exec_sql'::regproc)",
        icon: <Code className="w-4 h-4 text-blue-500" />
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
        icon: <CheckCircle2 className="w-4 h-4 text-orange-500" />
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
        icon: <Database className="w-4 h-4 text-emerald-500" />
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
        icon: <CheckCircle2 className="w-4 h-4 text-yellow-500" />
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

-- 4. Criar Policies RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Plans" ON plans FOR SELECT USING (true);

-- Permissão para Cristiano (Master)
CREATE POLICY "Admin Manage Plans" ON plans FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com'));

SELECT 'Migração Planos V2 concluída com sucesso!' as status;
`,
        icon: <Database className="w-4 h-4 text-purple-500" />
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
        icon: <Users className="w-4 h-4 text-blue-500" />
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
        icon: <Users className="w-4 h-4 text-green-500" />
    }
];

export default function SqlBank() {
    const [query, setQuery] = useState('');
    const [presetTitle, setPresetTitle] = useState<string | null>(null);
    const [results, setResults] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastExecuted, setLastExecuted] = useState<Date | null>(null);

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
                subtitle="V5.9.6 Master • Execução direta de comandos"
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
                    <div className="card-industrial p-6 sticky top-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                            <List className="w-4 h-4" />
                            Presets Rápidos
                        </h3>

                        <div className="space-y-3 font-medium">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => {
                                        setQuery(preset.query);
                                        setPresetTitle(preset.title);
                                    }}
                                    className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group flex items-start gap-4"
                                >
                                    <div className="mt-1 p-2 rounded bg-background border border-white/5 group-hover:text-primary transition-colors">
                                        {preset.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground/90 group-hover:text-primary transition-colors">{preset.title}</p>
                                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 font-mono uppercase">
                                            {preset.query}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="flex gap-2 text-orange-500">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed uppercase font-bold tracking-tight">
                                    CUIDADO: Comandos ALTER, DROP ou DELETE afetam a integridade estrutural do sistema imediatamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
