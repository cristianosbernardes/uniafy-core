
import { PageHeader } from '@/components/ui/PageHeader';

interface PlaceholderProps {
    title: string;
    subtitle: string;
}

export default function AgencyPlaceholder({ title, subtitle }: PlaceholderProps) {
    return (
        <div className="space-y-8">
            <PageHeader
                title="AGÊNCIA"
                titleAccent={title.toUpperCase()}
                subtitle={subtitle}
            />
            <div className="flex flex-col items-center justify-center h-[50vh] border border-dashed border-white/10 rounded-lg bg-white/5">
                <h2 className="text-xl font-bold text-muted-foreground uppercase tracking-widest">
                    Módulo em Desenvolvimento
                </h2>
                <p className="text-sm text-muted-foreground/60 mt-2">
                    A funcionalidade "{title}" estará disponível em breve.
                </p>
            </div>
        </div>
    );
}
