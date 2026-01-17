import { FileEdit, DollarSign, TrendingUp, Activity, CheckCircle2, Zap } from 'lucide-react';
import { IAProtocolCard } from '@/components/ui/IAProtocolCard';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Premium Gradient Header - Millionaire App Style */}
      <div className="relative bg-zinc-950 rounded-2xl p-8 overflow-hidden border border-white/5 shadow-2xl">
        {/* Background Architecture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600] to-[#E85D04] opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Glass Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                  Dashboard Central
                </h1>
                {/* Badge "Live" */}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">Live View</span>
                </span>
              </div>
              <p className="text-orange-50 font-medium text-sm max-w-lg">
                Visão geral da performance, protocolos de IA e saúde financeira.
              </p>
            </div>
          </div>

          <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm shadow-xl">
            <FileEdit className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPI Grid - Premium Solid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Investimento */}
        <div className="relative bg-[#09090b] border border-white/5 rounded-xl p-5 overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Investimento Total</h3>
              <span className="text-2xl font-semibold text-white tracking-tight">R$ 12.840</span>
            </div>
          </div>
        </div>

        {/* Faturamento */}
        <div className="relative bg-[#09090b] border border-white/5 rounded-xl p-5 overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-green-500/10 rounded-lg border border-green-500/20 text-green-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400 bg-green-900/20 px-2 py-1 rounded-full border border-green-500/10">
                <TrendingUp className="w-3 h-3" /> +18%
              </span>
            </div>
            <div>
              <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Faturamento</h3>
              <span className="text-2xl font-semibold text-white tracking-tight">R$ 54.210</span>
            </div>
          </div>
        </div>

        {/* ROI Master */}
        <div className="relative bg-[#09090b] border border-white/5 rounded-xl p-5 overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-500">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-purple-400/80 uppercase tracking-widest pl-1">Target: 4.0x</span>
            </div>
            <div>
              <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">ROI Master</h3>
              <span className="text-2xl font-semibold text-white tracking-tight">4.22x</span>
            </div>
          </div>
        </div>

        {/* Status Rede */}
        <div className="relative bg-[#09090b] border border-white/5 rounded-xl p-5 overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-orange-500/10 rounded-lg border border-orange-500/20 text-orange-500">
                <Zap className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-orange-400 bg-orange-900/20 px-2 py-1 rounded-full border border-orange-500/10">
                <CheckCircle2 className="w-3 h-3" /> Online
              </span>
            </div>
            <div>
              <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Status Rede</h3>
              <span className="text-2xl font-semibold text-white tracking-tight">Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* IA Protocol Card - kept as it is for now, but wrapper ensures spacing */}
      <IAProtocolCard
        version="5.9.1"
        title="Otimização"
        titleAccent="Sistêmica"
        description="Detectamos saturação de público no cluster Facebook Ads. Recomendamos escala horizontal imediata através de novos nodes de criativos."
        primaryAction={{
          label: 'Aplicar Escala',
          onClick: () => { },
        }}
        secondaryAction={{
          label: 'Detalhes',
          onClick: () => { },
        }}
      />
    </div>
  );
}
