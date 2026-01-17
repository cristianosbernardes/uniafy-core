
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PublicDashboardView() {
    const { token } = useParams<{ token: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    // Initial Load
    useEffect(() => {
        if (token) loadDashboard();
    }, [token]);

    const loadDashboard = async () => {
        try {
            // Call the secure RPC
            const { data: result, error } = await supabase.rpc('get_public_dashboard_by_token', {
                p_token: token
            });

            if (error) throw error;
            if (!result) throw new Error("Dashboard não encontrado ou expirado.");

            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao carregar dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-lg font-light">Carregando visualização segura...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Link Inválido ou Expirado</h1>
                    <p className="text-zinc-400 max-w-md">
                        Este link de dashboard não está mais disponível. Entre em contato com sua agência para solicitar um novo acesso.
                    </p>
                </div>
            </div>
        );
    }

    const { dashboard, agency } = data;
    const config = dashboard.config_json || {};

    // Mock Chart Data (Real impl would fetch metrics based on config)
    const chartData = [
        { name: 'Jan', value: 4000 },
        { name: 'Fev', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Abr', value: 2780 },
        { name: 'Mai', value: 1890 },
        { name: 'Jun', value: 2390 },
    ];

    const brandingColor = agency.branding_colors?.primary || '#F97316';

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header / Branding */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {agency.branding_logo ? (
                            <img src={agency.branding_logo} alt={agency.company_name} className="h-8 w-auto" />
                        ) : (
                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary text-xs">A</span>
                            </div>
                        )}
                        <span className="font-bold uppercase tracking-wider text-sm md:text-base">
                            {agency.company_name || 'Agência'}
                        </span>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                        VISUALIZAÇÃO SEGURA
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">

                {/* Welcome Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-light">
                        Relatório de Performance
                    </h1>
                    <p className="text-zinc-400">
                        Visualizando dados em tempo real. Última atualização: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title="Investimento" value="R$ 14.230" icon={<DollarSign className="w-4 h-4" />} color={brandingColor} />
                    <KpiCard title="Total Leads" value="3,402" icon={<Users className="w-4 h-4" />} color={brandingColor} />
                    <KpiCard title="CPL Médio" value="R$ 4,18" icon={<TrendingUp className="w-4 h-4" />} color={brandingColor} />
                    <KpiCard title="Taxa de Conv." value="12.5%" icon={<Activity className="w-4 h-4" />} color={brandingColor} />
                </div>

                {/* Main Charts */}
                <Card className="bg-[#111] border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-light uppercase tracking-wide">Evolução de Leads</CardTitle>
                        <CardDescription>Comparativo semestral</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill={brandingColor} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Footer Disclaimer */}
                <footer className="pt-12 text-center text-xs text-zinc-600">
                    <p>Este relatório foi gerado automaticamente pela plataforma {agency.company_name}.</p>
                    <p className="mt-2 text-[10px] opacity-50">Powered by Uniafy White Label Tech</p>
                </footer>

            </main>
        </div>
    );
}

function KpiCard({ title, value, icon, color }: any) {
    return (
        <Card className="bg-[#111] border-white/10 hover:border-white/20 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
                </div>
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-80"
                    style={{ backgroundColor: `${color}20`, color: color }}
                >
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}
