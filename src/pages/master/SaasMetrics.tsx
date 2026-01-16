import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MOCK_SAAS_METRICS, MOCK_TELEMETRY } from '@/services/mockSaaS';
import { MOCK_TRANSACTIONS } from '@/services/mockMaster';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users, CreditCard } from 'lucide-react';

export default function SaasMetrics() {

    const COLORS = ['#F97316', '#DC2626', '#10B981', '#EAB308'];

    // Dados Mock para Gráficos
    const mrrData = [
        { month: 'Jan', value: 32000 },
        { month: 'Fev', value: 34500 },
        { month: 'Mar', value: 33800 },
        { month: 'Abr', value: 38000 },
        { month: 'Mai', value: 42000 },
        { month: 'Jun', value: 45900 },
    ];

    const churnData = [
        { name: 'Ativos', value: 450 },
        { name: 'Churn (Cancelados)', value: 12 },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="MÉTRICAS"
                titleAccent="SAAS"
                subtitle="Master Suite • Inteligência financeira e recorrência"
                actions={[
                    { label: 'Relatório PDF', icon: DollarSign, variant: 'outline' }
                ]}
            />

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {MOCK_SAAS_METRICS.map((metric, index) => (
                    <div key={index} className="glass-card p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <DollarSign className="w-16 h-16" />
                        </div>

                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-medium uppercase text-muted-foreground">{metric.label}</span>
                            <Badge variant="outline" className={`text-[9px] font-bold border-none ${metric.trend === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                            </Badge>
                        </div>

                        <div>
                            <div className="text-2xl font-medium tracking-tight text-white">
                                {typeof metric.value === 'number' && metric.value > 100
                                    ? formatCurrency(metric.value)
                                    : metric.value}
                            </div>
                            <span className="text-[9px] text-muted-foreground uppercase opacity-60">{metric.period}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Gráfico MRR */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-sm font-bold uppercase text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full" />
                        Evolução do MRR (Receita Recorrente Mensal)
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mrrData}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMrr)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Churn Radar & Transações */}
                <div className="space-y-6">
                    <div className="glass-card p-6 h-[250px]">
                        <h3 className="text-sm font-bold uppercase text-white mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-red-500 rounded-full" />
                            Saúde da Base (Churn)
                        </h3>
                        <div className="h-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={churnData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#27272a" />
                                        <Cell fill="#DC2626" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="block text-2xl font-medium tracking-tight text-white">2.6%</span>
                                    <span className="text-[9px] text-muted-foreground uppercase">Churn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <h3 className="text-[10px] font-bold uppercase text-white flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-primary" />
                                Últimas Transações
                            </h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {MOCK_TRANSACTIONS.slice(0, 3).map(tx => (
                                <div key={tx.id} className="p-3 flex justify-between items-center group hover:bg-white/5 transition-colors">
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-300 uppercase">{tx.tenant_name}</div>
                                        <div className="text-[9px] text-muted-foreground">{tx.date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-white uppercase">{formatCurrency(tx.amount)}</div>
                                        <Badge variant="outline" className={`text-[8px] h-4 px-1 border-none ${tx.status === 'paid' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
