import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function OperationalSchedule() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="AGENDA"
                titleAccent="OPERACIONAL"
                subtitle="Cronograma e planejamento"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Agenda Operacional em Construção"
                description="O calendário de operações ficará aqui."
                icon="Calendar"
            />
        </div>
    );
}
