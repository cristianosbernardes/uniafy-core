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
  Filter
} from 'lucide-react';
import { MOCK_SUBSCRIPTIONS, MOCK_PLANS } from '@/services/mockMaster';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function GestaoClientes() {
  const [searchTerm, setSearchTerm] = useState('');

  // KPIs
  const totalMRR = MOCK_SUBSCRIPTIONS.reduce((acc, sub) => sub.status === 'active' ? acc + sub.amount : acc, 0);
  const activeClients = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'active').length;
  const riskClients = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'past_due').length;

  const getPlanName = (id: string) => MOCK_PLANS.find(p => p.id === id)?.name || 'Desconhecido';

  const getDaysUntilDue = (dateStr: string) => {
    return differenceInDays(new Date(dateStr), new Date());
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

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-xs font-black uppercase text-muted-foreground">MRR (Recorrência)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMRR)}
            </span>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">+12%</Badge>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-xs font-black uppercase text-muted-foreground">Agências Ativas</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeClients}</span>
            <span className="text-xs text-muted-foreground uppercase">de {MOCK_SUBSCRIPTIONS.length} total</span>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group border-red-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h3 className="text-xs font-black uppercase text-red-400">Em Risco (Inadimplentes)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{riskClients}</span>
            <span className="text-xs text-muted-foreground uppercase">Ação necessária</span>
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
              className="pl-10 h-10 bg-black/40 border-white/10 text-xs font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 border-white/10 bg-white/5 gap-2 text-[10px] font-black uppercase">
            <Filter className="w-4 h-4" /> FILTROS
          </Button>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 text-[10px] font-black uppercase text-muted-foreground border-b border-white/5">
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
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      ID: {sub.tenant_id}
                    </span>
                  </div>
                </div>

                {/* Plan */}
                <div className="col-span-2">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase">
                    {getPlanName(sub.plan_id)}
                  </Badge>
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  {sub.status === 'active' && (
                    <Badge className="bg-green-500/20 text-green-500 border-none text-[10px] font-black uppercase hover:bg-green-500/30">Ativo</Badge>
                  )}
                  {sub.status === 'past_due' && (
                    <Badge className="bg-red-500/20 text-red-500 border-none text-[10px] font-black uppercase hover:bg-red-500/30">Pendente</Badge>
                  )}
                </div>

                {/* Billing Info */}
                <div className="col-span-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{format(new Date(sub.next_billing_date), "dd 'de' MMM, yyyy", { locale: ptBR }).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{sub.payment_method}</span>
                    <span className="text-xs font-black text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.amount)}
                    </span>

                    {/* Alerts */}
                    {isNearDue && (
                      <Badge variant="destructive" className="ml-2 text-[9px] h-5">VENCE EM BREVE</Badge>
                    )}
                    {isLate && (
                      <Badge variant="destructive" className="ml-2 text-[9px] h-5 bg-red-900 border-red-700">ATRASADO</Badge>
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
