import { useState } from 'react';
import { Database, Play, Trash2, List, Code, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
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
    }
];

export default function SqlBank() {
    const [query, setQuery] = useState('');
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
        setResults(null);
        setError(null);
        setLastExecuted(null);
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-700">
            <PageHeader
                title="BANCO SQL"
                titleAccent="INDUSTRIAL"
                subtitle="V5.9.6 MASTER • EXECUÇÃO DIRETA DE COMANDOS"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Editor Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card-industrial p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground mr-4">Editor de Query SQL</span>
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
                                    onClick={() => setQuery(preset.query)}
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
