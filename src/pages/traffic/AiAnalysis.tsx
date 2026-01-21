import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function AiAnalysis() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="ANÁLISE"
                titleAccent="IA"
                subtitle="Insights gerados por inteligência artificial"
                badge="ESPECIALISTAS"
            />

            <EmptyPlaceholder
                title="Análise IA em Construção"
                description="O cérebro digital está sendo calibrado."
                icon="Brain"
            />
        </div>
    );
}
