import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Search,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  MoreVertical,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Activity,
  UserMinus,
  Wallet
} from 'lucide-react';
import {
  MOCK_SUBSCRIPTIONS,
  MOCK_PLANS,
  MOCK_MRR_HISTORY,
  MOCK_REVENUE_BY_PLAN
} from '@/services/mockMaster';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  Cell,
  Legend
} from 'recharts';

export default function GestaoClientes() {
  const [searchTerm, setSearchTerm] = useState('');

  // KPIs Calculations
  const totalMRR = MOCK_SUBSCRIPTIONS.reduce((acc, sub) => sub.status === 'active' ? acc + sub.amount : acc, 0);
  const activeClients = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'active').length;
  const riskClients = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'past_due').length;

  // Advanced SaaS Metrics (Mocked Logic)
  const arpu = totalMRR / (activeClients || 1);
  const churnRate = 1.2; // Mocked 1.2%
  const ltv = arpu / (churnRate / 100);

  const getPlanName = (id: string) => MOCK_PLANS.find(p => p.id === id)?.name || 'Desconhecido';

  const getDaysUntilDue = (dateStr: string) => {
    return differenceInDays(new Date(dateStr), new Date());
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-white/10 p-3 rounded shadow-xl">
          <p className="text-white font-bold text-sm mb-1">{label}</p>
          <p className="text-primary text-xs font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
          </p>
          <p className="text-zinc-400 text-[10px] mt-1">
            {payload[0].payload.customers} clientes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="GESTÃO DE"
        titleAccent="ASSINATURAS"
        subtitle="Master Suite • Controle de agências e white label"
        actions={[
          {
            label: 'Novo Cliente',
            icon: Building2,
            variant: 'primary',
          },
        ]}
      />

      {/* Primary KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-sm font-black uppercase text-muted-foreground">MRR (Recorrência)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMRR)}
            </span>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs font-bold">+12%</Badge>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-sm font-black uppercase text-muted-foreground">ARPU (Médio/Cliente)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(arpu)}
            </span>
            <span className="text-xs text-blue-400 font-medium">Saudável</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-purple-500" />
          </div>
          <h3 className="text-sm font-black uppercase text-muted-foreground">LTV (Lifetime Value)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(ltv)}
            </span>
            <span className="text-xs text-muted-foreground">Est.</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group border-red-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserMinus className="w-16 h-16 text-red-500" />
          </div>
          <h3 className="text-sm font-black uppercase text-red-400">Churn Rate</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{churnRate}%</span>
            <span className="text-xs text-red-400 font-bold">Abaixo da média</span>
          </div>
        </div>
      </div>

      {/* Analytics Lists & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MRR Evolution Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black uppercase text-white">Evolução de MRR</h3>
              <p className="text-xs text-muted-foreground">Crescimento de receita recorrente (6 meses)</p>
            </div>
            <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> Crescimento Contínuo
            </Badge>
          </div>

          <div className="w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MRR_HISTORY}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24 100% 52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(24 100% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#ffffff40"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#ffffff40"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(24 100% 52%)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Chart */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <div className="mb-4">
            <h3 className="text-sm font-black uppercase text-white">Receita por Plano</h3>
            <p className="text-xs text-muted-foreground">Distribuição do faturamento mensal</p>
          </div>

          <div className="w-full h-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_REVENUE_BY_PLAN}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_REVENUE_BY_PLAN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value, entry: any) => <span className="text-xs font-bold text-zinc-300 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <div className="text-2xl font-black text-white">{MOCK_SUBSCRIPTIONS.length}</div>
              <div className="text-[10px] uppercase text-muted-foreground font-bold">Assinaturas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar agência..."
              className="pl-10 h-10 bg-black/40 border-white/10 text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 border-white/10 bg-white/5 gap-2 text-xs font-black uppercase">
            <Filter className="w-4 h-4" /> FILTROS
          </Button>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 text-xs font-black uppercase text-muted-foreground border-b border-white/5">
          <div className="col-span-4">Agência / Tenant</div>
          <div className="col-span-2">Plano</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3">Vencimento & Valor</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-white/5">
          {MOCK_SUBSCRIPTIONS.filter(s => s.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())).map((sub) => {
            const daysToDue = getDaysUntilDue(sub.next_billing_date);
            const isNearDue = daysToDue >= 0 && daysToDue <= 3;
            const isLate = daysToDue < 0;

            return (
              <div key={sub.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                {/* Agency Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {sub.tenant_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{sub.tenant_name}</h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      ID: {sub.tenant_id}
                    </span>
                  </div>
                </div>

                {/* Plan */}
                <div className="col-span-2">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-xs font-bold uppercase text-zinc-400">
                    {getPlanName(sub.plan_id)}
                  </Badge>
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  {sub.status === 'active' && (
                    <Badge className="bg-green-500/10 text-green-500 border-none text-xs font-black uppercase">Ativo</Badge>
                  )}
                  {sub.status === 'past_due' && (
                    <Badge className="bg-red-500/10 text-red-500 border-none text-xs font-black uppercase">Pendente</Badge>
                  )}
                </div>

                {/* Billing Info */}
                <div className="col-span-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{format(new Date(sub.next_billing_date), "dd 'de' MMM, yyyy", { locale: ptBR }).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">{sub.payment_method}</span>
                    <span className="text-xs font-black text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.amount)}
                    </span>

                    {/* Alerts */}
                    {isNearDue && (
                      <Badge variant="destructive" className="ml-2 text-[10px] h-5 bg-orange-500/20 text-orange-500 border-none">VENCE EM BREVE</Badge>
                    )}
                    {isLate && (
                      <Badge variant="destructive" className="ml-2 text-[10px] h-5 bg-red-900/50 text-red-500 border-red-900">ATRASADO</Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
