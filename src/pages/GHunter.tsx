import { PageHeader } from "@/components/ui/PageHeader";
import {
    Radar,
    Search,
    Filter,
    Download,
    MapPin,
    Globe,
    Phone,
    Target,
    CheckCircle2,
    XCircle,
    Database,
    Play,
    RefreshCw,
    Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LeadResult {
    id: string;
    name: string;
    phone: string;
    website: string;
    rating: number;
    reviews: number;
    hasPixel: boolean;
    status: 'pending' | 'extracted';
}

const MOCK_RESULTS: LeadResult[] = [
    { id: '1', name: 'Ortodontia Sorriso Real', phone: '(11) 98877-6655', website: 'ortosorriso.com.br', rating: 4.8, reviews: 124, hasPixel: true, status: 'extracted' },
    { id: '2', name: 'Clínica Dr. Silva', phone: '(11) 97766-5544', website: 'clinicasilva.com.br', rating: 4.2, reviews: 89, hasPixel: false, status: 'extracted' },
    { id: '3', name: 'Dental Center SP', phone: '(11) 96655-4433', website: 'dentalcenter.com.br', rating: 4.5, reviews: 210, hasPixel: true, status: 'extracted' },
    { id: '4', name: 'Sorria Mais Tatuapé', phone: '(11) 95544-3322', website: 'sorriamais.com.br', rating: 3.9, reviews: 45, hasPixel: false, status: 'extracted' },
];

export default function GHunter() {
    const [niche, setNiche] = useState("");
    const [city, setCity] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleStartSearch = () => {
        setIsSearching(true);
        // Simula disparo para n8n
        setTimeout(() => setIsSearching(false), 3000);
    };

    return (
        <div className="p-8 animate-in fade-in duration-700">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <PageHeader
                    title="G-HUNTER"
                    titleAccent="SCRAPER"
                    subtitle="MÁQUINA DE PROSPECÇÃO • EXTRAÇÃO ESTRATÉGICA GOOGLE MAPS"
                />

                {/* Search Control Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Segmento / Nicho</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="EX: DENTISTAS, IMOBILIÁRIAS..."
                                        className="w-full bg-black/40 border border-border h-14 pl-12 pr-4 rounded text-sm font-black focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none uppercase"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Localização / Cidade</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="EX: SÃO PAULO, CURITIBA..."
                                        className="w-full bg-black/40 border border-border h-14 pl-12 pr-4 rounded text-sm font-black focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none uppercase"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartSearch}
                            disabled={isSearching || !niche || !city}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {isSearching ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Escaneando...
                                </>
                            ) : (
                                <>
                                    INICIAR EXTRAÇÃO ESTRATÉGICA
                                    <Play className="w-4 h-4" />
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
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Limite Diário</span>
                                <span className="text-[10px] font-black text-foreground uppercase">12.000 Leads</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Dashboard */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded border border-primary/20">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase italic leading-none">Resultados da Varredura</h2>
                                <p className="text-[10px] text-muted-foreground uppercase mt-1 font-bold opacity-60">Extração em tempo real • Inteligência Prospectiva</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-10 border-border bg-white/5 text-[10px] font-black uppercase px-6 gap-2">
                            Exportar CSV
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Tabela de Resultados */}
                    <div className="glass-card overflow-hidden relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase">Empresa</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase">Contato</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase">Pixel Meta</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase">Rating / Reviews</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {MOCK_RESULTS.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold uppercase">{lead.name}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground italic">
                                                        <Globe className="w-3 h-3" /> {lead.website}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-[11px] text-white/80">
                                                    <Phone className="w-3 h-3 text-primary/70" /> {lead.phone}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <div className={cn(
                                                        "px-2 py-1 rounded text-[9px] font-bold uppercase flex items-center gap-1.5",
                                                        lead.hasPixel
                                                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                    )}>
                                                        {lead.hasPixel ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        {lead.hasPixel ? "ADS ATIVO" : "SEM PIXEL"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-primary font-bold">{lead.rating}</span>
                                                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${(lead.rating / 5) * 100}%` }} />
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground uppercase">({lead.reviews})</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary">
                                                    <Search className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer info */}
                    <div className="flex justify-between items-center text-[9px] text-muted-foreground uppercase pt-8 border-t border-border/50">
                        <span>Sincronizado com API Industrial Maps</span>
                        <div className="flex gap-4">
                            <span className="text-primary/50 uppercase">• ENGINE V2.0</span>
                            <span className="text-primary/50 uppercase">• N8N PIPELINE CONNECTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
