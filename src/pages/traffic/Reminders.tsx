import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyPlaceholder } from "@/components/ui/EmptyPlaceholder";

export default function Reminders() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="LEMBRETES"
                titleAccent="& ALERTAS"
                subtitle="Sistema de notificações e pendências"
                badge="TRÁFEGO"
            />

            <EmptyPlaceholder
                title="Lembretes em Construção"
                description="Nunca mais esqueça uma otimização."
                icon="Bell"
            />
        </div>
    );
}
