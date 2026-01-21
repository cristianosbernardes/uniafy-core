import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function DataAnalysis() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="ANÁLISE DE"
                titleAccent="DADOS"
                subtitle="Deep dive em métricas de performance"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Análise de Dados em Construção"
                description="As ferramentas de Big Data estão a caminho."
                icon="LineChart"
            />
        </div>
    );
}
