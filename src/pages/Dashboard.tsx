import { FileEdit, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KPICard } from '@/components/ui/KPICard';
import { IAProtocolCard } from '@/components/ui/IAProtocolCard';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        titleAccent="Central"
        subtitle="V5.9.1 Master • Uniafy Central"
        actions={[
          {
            label: 'Exportar Relatório',
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
          value="Active"
          status="sync"
          variant="status"
          icon="wifi"
        />
      </div>

      {/* IA Protocol Card */}
      <IAProtocolCard
        version="5.9.1"
        title="Otimização"
        titleAccent="Sistêmica"
        description="Detectamos saturação de público no cluster Facebook Ads. Recomendamos escala horizontal imediata através de novos nodes de criativos."
        primaryAction={{
          label: 'Aplicar Escala',
          onClick: () => console.log('Apply scale'),
        }}
        secondaryAction={{
          label: 'Detalhes',
          onClick: () => console.log('Show details'),
        }}
      />
    </div>
  );
}
