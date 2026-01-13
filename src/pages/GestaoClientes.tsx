import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/ui/PageHeader';

export default function GestaoClientes() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="GESTÃO DE"
        titleAccent="CLIENTES"
        subtitle="V5.9.6 PRECISION CORE • 0 ESTAÇÕES EM MONITORAMENTO"
        actions={[
          {
            label: 'NOVO_PROTOCOLO_STATION',
            icon: Plus,
            variant: 'primary',
          },
        ]}
      />

      {/* Empty state */}
      <div className="card-industrial p-12 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-wider">
          Nenhuma estação cadastrada. Adicione sua primeira STATION para começar.
        </p>
      </div>
    </div>
  );
}
