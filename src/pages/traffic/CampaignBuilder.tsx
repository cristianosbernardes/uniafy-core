import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function CampaignBuilder() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="CRIADOR DE"
                titleAccent="CAMPANHAS"
                subtitle="Ferramenta de criação ágil"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Criador de Campanhas em Construção"
                description="O estúdio de criação está sendo montado."
                icon="Zap"
            />
        </div>
    );
}
