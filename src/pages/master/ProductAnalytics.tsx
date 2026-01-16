import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/card';
import { MOCK_TELEMETRY } from '@/services/mockSaaS';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { Activity, MousePointerClick, Users, Clock } from 'lucide-react';

export default function ProductAnalytics() {

    // Processamento de dados para gráficos
    // 1. Agrupar por Módulo (Bar Chart)
    const moduleCounts = MOCK_TELEMETRY.reduce((acc, curr) => {
        acc[curr.module] = (acc[curr.module] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(moduleCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // 2. Dados de Atividade ao Longo do Tempo (Line Chart fictício para demo)
    const activityData = [
        { time: '08:00', desktop: 120, mobile: 20 },
        { time: '10:00', desktop: 300, mobile: 45 },
        { time: '12:00', desktop: 180, mobile: 90 },
        { time: '14:00', desktop: 450, mobile: 30 },
        { time: '16:00', desktop: 380, mobile: 50 },
        { time: '18:00', desktop: 200, mobile: 80 },
        { time: '20:00', desktop: 100, mobile: 100 },
    ];

    const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EAB308', '#8B5CF6'];

    return (
        <div className="space-y-8">
            <PageHeader
                title="PRODUCT"
                titleAccent="ANALYTICS"
                subtitle="Master Suite • Telemetria e uso do sistema"
                badge="BETA"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 relative overflow-hidden group">
                    <Activity className="absolute top-4 right-4 text-primary/20 w-8 h-8" />
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground">Eventos Hoje</h3>
                    <div className="mt-2 text-3xl font-black text-white">{MOCK_TELEMETRY.length}</div>
                    <span className="text-[9px] text-primary uppercase font-bold">+12% vs ontem</span>
                </div>
                <div className="glass-card p-6 relative overflow-hidden group">
                    <Users className="absolute top-4 right-4 text-blue-500/20 w-8 h-8" />
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground">Usuários Ativos</h3>
                    <div className="mt-2 text-3xl font-black text-white">84</div>
                    <span className="text-[9px] text-blue-500 uppercase font-bold">42 online agora</span>
                </div>
                <div className="glass-card p-6 relative overflow-hidden group">
                    <MousePointerClick className="absolute top-4 right-4 text-green-500/20 w-8 h-8" />
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground">Taxa de Cliques</h3>
                    <div className="mt-2 text-3xl font-black text-white">4.2%</div>
                    <span className="text-[9px] text-green-500 uppercase font-bold">Alta engajamento</span>
                </div>
                <div className="glass-card p-6 relative overflow-hidden group">
                    <Clock className="absolute top-4 right-4 text-purple-500/20 w-8 h-8" />
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground">Tempo Médio</h3>
                    <div className="mt-2 text-3xl font-black text-white">18m</div>
                    <span className="text-[9px] text-purple-500 uppercase font-bold">Sessão por usuário</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Gráfico de Barras - Módulos Mais Usados */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-black uppercase text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full" />
                        Funcionalidades Mais Acessadas
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Linha - Tráfego */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-black uppercase text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full" />
                        Tráfego em Tempo Real (Hoje)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="desktop"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    dot={{ fill: '#F97316', strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mobile"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
