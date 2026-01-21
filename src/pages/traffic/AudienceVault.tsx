import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function AudienceVault() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="COFRE DE"
                titleAccent="PÚBLICOS"
                subtitle="Biblioteca de personas e listas de exclusão"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Cofre de Públicos em Construção"
                description="O banco de dados de audiências está sendo estruturado."
                icon="Users"
            />
        </div>
    );
}
