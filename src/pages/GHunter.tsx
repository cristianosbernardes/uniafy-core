import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Database, Globe, Phone, Mail, Instagram, CheckCircle2, AlertCircle, Info, Send, Building2, User, Radar } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

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

    const handleStartScrape = () => {
        if (!nicho || !cidade) {
            toast.error('Informe o nicho e a cidade para iniciar a busca.');
            return;
        }

        setIsScraping(true);

        // Simulando o disparo para o n8n
        toast.info(`Workflow n8n disparado para ${nicho} em ${cidade}.`);

        // Simulação de delay do scraper
        setTimeout(() => {
            setIsScraping(false);
            toast.success('Busca concluída! Os dados estão sendo processados pela IA.');
            fetchLeads();
        }, 4000);
    };

    return (
        <DashboardShell>
            <div className="p-8 space-y-8">
                <PageHeader
                    title="G-HUNTER"
                    titleAccent="SCRAPER"
                    subtitle="MÓDULO GROWTH ENGINE • CAPTAÇÃO ATIVA DE LEADS VIA GOOGLE MAPS"
                />

                {/* Search Panel */}
                <div className="card-industrial p-6 flex flex-col md:flex-row gap-6 items-end bg-black/40 border-white/5">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/80">Segmento / Nicho</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Ex: Clínica de Estética, Oficina Mecânica..."
                                className="pl-10 bg-black/40 border-white/10 text-sm focus:border-primary/50"
                                value={nicho}
                                onChange={(e) => setNicho(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/80">Localização (Cidade/Bairro)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Ex: Moema, São Paulo..."
                                className="pl-10 bg-black/40 border-white/10 text-sm focus:border-primary/50"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleStartScrape}
                        disabled={isScraping}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 gap-2 group shadow-lg shadow-primary/20"
                    >
                        {isScraping ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-white rounded-full animate-spin" />
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

                {/* Results List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Leads Identificados ({leads.length})
                        </h3>
                        <div className="flex gap-2 text-[10px] font-mono uppercase text-muted-foreground">
                            <span className="flex items-center gap-1"><Info className="w-3 h-3 text-primary" /> Inteligência de Dados Ativa</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loadingLeads ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-[200px] card-industrial animate-pulse bg-white/5 border-white/5" />
                                ))
                            ) : leads.map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="card-industrial p-5 flex flex-col gap-4 group hover:border-primary/30 transition-all bg-[#0A0A0A]"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white uppercase tracking-tight line-clamp-1">{lead.nome_empresa}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {lead.cidade} • {lead.nicho}
                                            </p>
                                        </div>
                                        {lead.possui_pixel ? (
                                            <Badge variant="outline" className="text-[9px] border-primary/20 bg-primary/5 text-primary">PIXEL DETECTADO</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] border-orange-500/20 bg-orange-500/5 text-orange-500">SEM PIXEL (HOT)</Badge>
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5" title={lead.telefone}>
                                                <Phone className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        {lead.site && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5" onClick={() => window.open(lead.site, '_blank')}>
                                                <Globe className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        {lead.instagram && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                                                <Instagram className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button className="ml-auto h-8 text-[10px] font-bold uppercase px-3 gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-none">
                                            Abrir Lead <Send className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>

                    {leads.length === 0 && !loadingLeads && (
                        <div className="p-20 text-center card-industrial border-dashed border-white/10">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Radar className="w-8 h-8 text-muted-foreground animate-pulse" />
                            </div>
                            <h4 className="text-muted-foreground font-mono uppercase tracking-widest text-sm">Nenhum lead capturado para este radar.</h4>
                            <p className="text-xs text-muted-foreground/60 mt-2">Inicie uma varredura acima para preencher seu banco de dados.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
