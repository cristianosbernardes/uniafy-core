import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function TrafficDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="PAINEL"
                titleAccent="CENTRAL"
                subtitle="Visão geral do desempenho de tráfego"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Painel Central em Construção"
                description="Em breve você terá acesso a todas as métricas consolidadas aqui."
                icon="BarChart3"
            />
        </div>
    );
}
