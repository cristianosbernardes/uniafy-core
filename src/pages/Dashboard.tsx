import { FileEdit, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KPICard } from '@/components/ui/KPICard';
import { IAProtocolCard } from '@/components/ui/IAProtocolCard';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <PageHeader
        title="DASHBOARD"
        titleAccent="CENTRAL"
        subtitle="V5.9.1 MASTER • UNIAFY CENTRAL"
        actions={[
          {
            label: 'EXPORTAR RELATÓRIO',
            icon: FileEdit,
            variant: 'outline',
          },
        ]}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Investimento"
          value="R$ 12.840"
          change={4}
          status="sync"
          icon="dollar"
        />
        <KPICard
          label="Faturamento"
          value="R$ 54.210"
          change={18}
          status="sync"
          icon="trending"
        />
        <KPICard
          label="ROI Master"
          value="4.22x"
          change={1.2}
          status="sync"
          icon="chart"
        />
        <KPICard
          label="Status Rede"
          value="ACTIVE"
          status="sync"
          variant="status"
          icon="wifi"
        />
      </div>

      {/* IA Protocol Card */}
      <IAProtocolCard
        version="5.9.1"
        title="OTIMIZAÇÃO"
        titleAccent="SISTÊMICA"
        description="DETECTAMOS SATURAÇÃO DE PÚBLICO NO CLUSTER FACEBOOK ADS. RECOMENDAMOS ESCALA HORIZONTAL IMEDIATA ATRAVÉS DE NOVOS NODES DE CRIATIVOS."
        primaryAction={{
          label: 'APLICAR ESCALA',
          onClick: () => console.log('Apply scale'),
        }}
        secondaryAction={{
          label: 'DETALHES',
          onClick: () => console.log('Show details'),
        }}
      />
    </div>
  );
}
