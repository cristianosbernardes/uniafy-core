import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreationCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    title: string;
    description?: string;
    gradient?: string;
    iconColor?: string;
}

export function CreationCard({
    icon: Icon = Plus,
    title,
    description,
    className,
    gradient = "from-primary/10 via-primary/5 to-transparent",
    iconColor = "text-primary",
    ...props
}: CreationCardProps) {
    return (
        <button
            className={cn(
                "group relative flex flex-col items-center justify-center p-8 text-center transition-all duration-500",
                "bg-black/40 border border-dashed border-white/10 hover:border-primary/50 active:scale-95",
                "rounded-xl overflow-hidden min-h-[200px] w-full",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    gradient
                )}
            />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                    <Icon className={cn("w-8 h-8 transition-colors duration-300", iconColor)} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide opacity-60 max-w-[200px]">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}
