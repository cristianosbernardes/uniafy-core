import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function GroupSentinel() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="SENTINELA DE"
                titleAccent="GRUPOS"
                subtitle="Monitoramento e automação de grupos"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Sentinela de Grupos em Construção"
                description="O módulo de monitoramento está sendo implementado."
                icon="ShieldAlert"
            />
        </div>
    );
}
