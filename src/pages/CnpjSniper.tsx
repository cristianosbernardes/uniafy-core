import { PageHeader } from "@/components/ui/PageHeader";
import {
    Search,
    MapPin,
    Calendar,
    DollarSign,
    Building2,
    FileText,
    Filter,
    Download,
    Phone,
    Briefcase,
    Target,
    CheckCircle2,
    XCircle,
    Info,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyResult {
    id: string;
    fantasyName: string;
    socialReason: string;
    cnpj: string;
    phone: string;
    capital: string;
    type: string;
    porte: string;
    status: 'ATIVA' | 'INATIVA';
    openingDate: string;
}

const MOCK_COMPANIES: CompanyResult[] = [
    {
        id: '1',
        fantasyName: 'UNIAFY TECNOLOGIA',
        socialReason: 'UNIAFY SISTEMAS LTDA',
        cnpj: '12.345.678/0001-90',
        phone: '(11) 99988-7766',
        capital: 'R$ 500.000,00',
        type: 'Matriz',
        porte: 'DEMAIS',
        status: 'ATIVA',
        openingDate: '12/10/2020'
    },
    {
        id: '2',
        fantasyName: 'AGÊNCIA ELITE',
        socialReason: 'ELITE MARKETING DIGITAL ME',
        cnpj: '98.765.432/0001-21',
        phone: '(21) 98877-5544',
        capital: 'R$ 50.000,00',
        type: 'Matriz',
        porte: 'ME',
        status: 'ATIVA',
        openingDate: '05/03/2022'
    },
];

export default function CnpjSniper() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="p-8 animate-in fade-in duration-700">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <PageHeader
                    title="CNPJ"
                    titleAccent="SNIPER"
                    subtitle="MOTOR DE BUSCA ESTRATÉGICO • INTELIGÊNCIA DE DADOS EMPRESARIAIS"
                />

                {/* Industrial Filter Panel */}
                <div className="glass-card p-8 space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {/* Basic Info */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-primary" /> Razão Social / Fantasia
                            </label>
                            <input
                                type="text"
                                placeholder="Digite o nome..."
                                className="input-industrial"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <FileText className="w-3 h-3 text-primary" /> Códigos CNAE
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: 6201-5/00"
                                className="input-industrial"
                            />
                        </div>

                        {/* Geographic */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" /> Estado (UF)
                            </label>
                            <select className="input-industrial bg-black/40">
                                <option value="">Todos os Estados</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="MG">Minas Gerais</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" /> Município
                            </label>
                            <input
                                type="text"
                                placeholder="Nome da cidade..."
                                className="input-industrial"
                            />
                        </div>

                        {/* Capital Social Range */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-primary" /> Capital Social (De)
                            </label>
                            <input
                                type="number"
                                placeholder="R$ 0,00"
                                className="input-industrial"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-primary" /> Capital Social (Até)
                            </label>
                            <input
                                type="number"
                                placeholder="R$ 10.000.000,00"
                                className="input-industrial"
                            />
                        </div>

                        {/* Dates */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-primary" /> Abertura (Desde)
                            </label>
                            <input
                                type="date"
                                className="input-industrial"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-primary" /> Abertura (Até)
                            </label>
                            <input
                                type="date"
                                className="input-industrial"
                            />
                        </div>

                        {/* Status & Options */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-2">
                                <Info className="w-3 h-3 text-primary" /> Situação Cadastral
                            </label>
                            <select className="input-industrial bg-black/40">
                                <option value="ATIVA">ATIVA</option>
                                <option value="INATIVA">INATIVA</option>
                                <option value="SUSPENSA">SUSPENSA</option>
                            </select>
                        </div>

                        <div className="lg:col-span-3 flex flex-wrap items-end gap-x-8 gap-y-4 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className="w-5 h-5 border border-border rounded flex items-center justify-center bg-white/5 group-hover/check:border-primary/50 transition-colors">
                                    <input type="checkbox" className="hidden" />
                                    <div className="w-2 h-2 bg-primary rounded-sm opacity-0 group-hover/check:opacity-20 transition-opacity" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase group-hover/check:text-foreground">Somente MEI</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className="w-5 h-5 border border-border rounded flex items-center justify-center bg-white/5 group-hover/check:border-primary/50 transition-colors">
                                    <input type="checkbox" className="hidden" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase group-hover/check:text-foreground">Excluir MEI</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className="w-5 h-5 border border-border rounded flex items-center justify-center bg-white/5 group-hover/check:border-primary/50 transition-colors">
                                    <input type="checkbox" className="hidden" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase group-hover/check:text-foreground">Com Telefone</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className="w-5 h-5 border border-border rounded flex items-center justify-center bg-white/5 group-hover/check:border-primary/50 transition-colors">
                                    <input type="checkbox" className="hidden" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase group-hover/check:text-foreground">Somente Matriz</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-border/50 relative z-10">
                        <Button
                            variant="outline"
                            className="h-12 px-8 text-[10px] font-bold uppercase tracking-wider border-border bg-white/5 hover:bg-white/10"
                        >
                            Limpar Filtros
                        </Button>
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="h-12 px-12 bg-primary hover:bg-primary/90 text-black font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 gap-3"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    INICIAR ESCANEAMENTO SNIPER
                                    <Target className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded border border-primary/20">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold uppercase italic leading-none">Empresas Localizadas</h2>
                                <p className="text-[10px] text-muted-foreground uppercase mt-1 font-bold opacity-60">Resultados Filtrados • Inteligência de Mercado</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-10 border-border bg-white/5 text-[10px] font-bold uppercase px-6 gap-2">
                                Exportar Excel
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">Empresa / Razão</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">CNPJ</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">Contato</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">Capital Social</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">Porte / Tipo</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {MOCK_COMPANIES.map((company) => (
                                        <tr key={company.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase">{company.fantasyName}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-medium">{company.socialReason}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-mono text-foreground/80">{company.cnpj}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[11px] text-foreground/80">
                                                    <Phone className="w-3 h-3 text-primary/70" /> {company.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-bold text-primary/90">{company.capital}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-foreground">{company.porte}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase">{company.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .input-industrial {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    height: 3.5rem;
                    padding: 0 1rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.3s;
                    outline: none;
                }
                .input-industrial:focus {
                    border-color: rgba(255, 85, 0, 0.3);
                    background: rgba(255, 85, 0, 0.02);
                    box-shadow: 0 0 15px rgba(255, 85, 0, 0.05);
                }
                .input-industrial::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}
