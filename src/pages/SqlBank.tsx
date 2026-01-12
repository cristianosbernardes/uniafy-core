import { useState } from 'react';
import { Database, Play, Trash2, List, Code, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
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
    }
];

export default function SqlBank() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunQuery = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // Usando RPC para executar o SQL (requer a função admin_exec_sql instalada no Supabase)
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
    };

    return (
        <DashboardShell>
            <div className="p-8 space-y-6">
                <PageHeader
                    title="BANCO SQL"
                    titleAccent="INDUSTRIAL"
                    subtitle="V5.9.6 MASTER • EXECUÇÃO DIRETA DE COMANDOS"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Editor e Resultados */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="card-industrial p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest">
                                    <Code className="w-3 h-3" />
                                    Editor de Query
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearQuery}
                                        className="h-8 w-8 text-muted-foreground hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all rounded-lg" />
                                <Textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="SELECT * FROM table..."
                                    className="min-h-[220px] font-mono text-sm bg-black/60 border-white/5 focus:border-primary/50 text-foreground/90 p-4 resize-none relative z-10"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
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

                        {/* Painel de Resultados */}
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

                    {/* Lateral de Presets */}
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
        </DashboardShell>
    );
}
