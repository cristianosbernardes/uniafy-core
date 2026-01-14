import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Database, Globe, Phone, Mail, Instagram, CheckCircle2, AlertCircle, Info, Send, Building2, User, Radar, Play, RefreshCw, Cpu, Target, Download, Plus, Bot } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CreationCard } from '@/components/ui/CreationCard';
import { ScrollHint } from '@/components/ui/ScrollHint';
import { triggerGHunterScrape } from '@/services/n8n';

interface Lead {
    id: string;
    nome_empresa: string;
    nicho: string;
    cidade: string;
    telefone: string;
    site: string;
    maps_rating: number;
    maps_reviews: number;
    possui_pixel: boolean;
    cnpj?: string;
    email_contato?: string;
    instagram?: string;
    status_crm: string;
}

export default function GHunter() {
    const [nicho, setNicho] = useState('');
    const [cidade, setCidade] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const { data, error } = await supabase
                .from('leads_prospect')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error: any) {
            console.error('Erro ao buscar leads:', error.message);
        } finally {
            setLoadingLeads(false);
        }
    };

    const handleStartScrape = async () => {
        if (!nicho || !cidade) {
            toast.error('Informe o nicho e a cidade para iniciar a busca.');
            return;
        }

        setIsScraping(true);
        toast.info(`Iniciando motor G-Hunter para ${nicho}...`);

        try {
            // Import dinâmico ou estático (vou adicionar o import no topo depois se precisar, 
            // mas aqui vou assumir que o usuário aceita que eu adicione o import via replace separado ou auto-fix)
            // PREFERÊNCIA: Fazer o import no topo primeiro? Não, vou usar o replace_file_content para o bloco todo se possível, 
            // mas preciso adicionar o import.
            // Vou usar uma estratégia segura: Adicionar o import primeiro.

            // Wait, I can't simple add lines easily without shifting lines.
            // I will implement the logic here assuming the import exists, and then add the import in a second step.

            await triggerGHunterScrape({ nicho, cidade });

            toast.success('Comando enviado! O agente está varrendo o Google Maps.');

            // Opcional: Recarregar leads após um tempo se o N8N for rápido, 
            // mas geralmente é assíncrono. Vamos manter um timeout curto para UX.
            setTimeout(() => {
                fetchLeads();
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error('Erro ao conectar com o motor de busca.');
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <PageHeader
                    title="G-HUNTER"
                    titleAccent="SCRAPER"
                    subtitle="GROWTH ENGINE • EXTRAÇÃO ESTRATÉGICA GOOGLE MAPS"
                />

                {/* Search Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 glass-card p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Segmento / Nicho</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                    <Input
                                        placeholder="EX: CLÍNICA DE ESTÉTICA, MECÂNICA..."
                                        className="bg-black/40 border-border h-14 pl-12 pr-4 rounded text-sm font-black focus:border-primary/50 uppercase"
                                        value={nicho}
                                        onChange={(e) => setNicho(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Localização (Cidade/Bairro)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                    <Input
                                        placeholder="EX: MOEMA, SÃO PAULO..."
                                        className="bg-black/40 border-border h-14 pl-12 pr-4 rounded text-sm font-black focus:border-primary/50 uppercase"
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartScrape}
                            disabled={isScraping}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm gap-3 shadow-xl shadow-primary/20"
                        >
                            {isScraping ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Varrendo G-Maps...
                                </>
                            ) : (
                                <>
                                    Iniciar Varredura
                                    <Radar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="glass-card p-6 space-y-6 relative overflow-hidden">
                        <h3 className="text-xs font-black uppercase text-primary flex items-center gap-2 border-b border-border pb-4">
                            <Cpu className="w-4 h-4" />
                            Status do Motor
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Proxy Status</span>
                                <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Latência</span>
                                <span className="text-[10px] font-black text-primary uppercase">124ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded border border-primary/20">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase italic leading-none">Resultados ({leads.length})</h2>
                                <p className="text-[10px] text-muted-foreground uppercase mt-1 font-bold opacity-60">Inteligência de Dados Ativa</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-10 border-border bg-white/5 text-[10px] font-black uppercase px-6 gap-2">
                            Exportar CSV <Download className="w-4 h-4" />
                        </Button>
                    </div>

                    <AnimatePresence>
                        <ScrollHint height="h-[600px]" className="pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                                <CreationCard
                                    title="Nova Varredura"
                                    description="Criar nova automação G-Hunter"
                                    icon={Radar}
                                    onClick={() => document.querySelector<HTMLInputElement>('input')?.focus()}
                                />

                                {loadingLeads ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-[200px] glass-card animate-pulse bg-white/5 border-white/5" />
                                    ))
                                ) : leads.map((lead) => (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-5 flex flex-col gap-4 group hover:border-primary/30 transition-all bg-black/40"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-white uppercase tracking-tight line-clamp-1">{lead.nome_empresa}</h4>
                                                <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {lead.cidade} • {lead.nicho}
                                                </p>
                                            </div>
                                            {lead.possui_pixel ? (
                                                <Badge variant="outline" className="text-[9px] border-green-500/20 bg-green-500/5 text-green-500">ADS ATIVO</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[9px] border-red-500/20 bg-red-500/5 text-red-500">SEM PIXEL</Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col gap-1">
                                                <span className="text-[9px] text-muted-foreground font-mono uppercase">Nota G-Maps</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-white">{lead.maps_rating}</span>
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(lead.maps_rating) ? 'bg-primary' : 'bg-white/10'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col gap-1">
                                                <span className="text-[9px] text-muted-foreground font-mono uppercase">Status CRM</span>
                                                <span className="text-[10px] font-bold text-primary uppercase">{lead.status_crm}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2 border-t border-white/5 mt-auto">
                                            {lead.telefone && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" title={lead.telefone}>
                                                    <Phone className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                            {lead.site && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => window.open(lead.site, '_blank')}>
                                                    <Globe className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                            <Button className="ml-auto h-8 text-[10px] font-bold uppercase px-3 gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-none">
                                                Abrir Lead <Send className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollHint>
                    </AnimatePresence>

                    {leads.length === 0 && !loadingLeads && (
                        <div className="p-20 text-center glass-card border-dashed border-white/10">
                            <Radar className="w-12 h-12 text-muted-foreground animate-pulse mx-auto mb-4" />
                            <h4 className="text-muted-foreground font-mono uppercase tracking-widest text-sm">Nenhum lead capturado.</h4>
                            <p className="text-xs text-muted-foreground/60 mt-2">Inicie uma varredura para preencher seu banco de dados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
