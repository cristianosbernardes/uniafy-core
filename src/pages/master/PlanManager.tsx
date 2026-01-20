import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { masterService } from '@/services/masterService';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Shield, Zap, Users, Globe, Database, Star, Loader2, AlertTriangle, Eye, Layout } from 'lucide-react';
import { Plan } from '@/types/uniafy';
import { UpdatePlanDialog } from './UpdatePlanDialog';
import { toast } from 'sonner';

export default function PlanManager() {
    const { user } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // God Mode Check: Hardcoded for security as requested
    const isSuperAdmin = user?.email === 'cristiano.sbernardes@gmail.com';

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await masterService.getPlans();

            if (!data || !Array.isArray(data)) {
                console.error("Formato de dados inválido recebido:", data);
                throw new Error("Formato de dados inválido");
            }

            // Map DB fields and ensure numbers for currency formatting
            const mappedPlans: Plan[] = data.map((p: any) => ({
                ...p,
                monthly_price_amount: Number(p.monthly_price_amount || 0),
                yearly_price_amount: Number(p.yearly_price_amount || 0),
                price: Number(p.monthly_price_amount || p.price || 0)
            }));

            setPlans(mappedPlans);
        } catch (error) {
            console.error(error);
            toast.error("Falha ao carregar planos do servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleEditClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
    };

    const formatCurrency = (value: number) => {
        if (value === 0) return 'Grátis / Interno';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // Icon Map
    const ICON_MAP: Record<string, any> = {
        'Zap': Zap,
        'Star': Star,
        'Globe': Globe,
        'Shield': Shield,
        'Database': Database,
        'LayoutTemplate': Layout
    };

    const getPlanIcon = (iconKey?: string, color?: string) => {
        const IconComponent = ICON_MAP[iconKey || 'Zap'] || Zap;
        return <IconComponent className="w-8 h-8" style={{ color: color || '#FF6600' }} />;
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="GESTÃO DE"
                titleAccent="PLANOS"
                subtitle="Master Suite • Configuração de planos e preços"
                actions={[
                    {
                        label: 'Novo Plano',
                        icon: Database,
                        variant: 'primary',
                        onClick: () => {
                            if (!isSuperAdmin) {
                                toast.error("Apenas Super Admin pode criar planos.");
                                return;
                            }
                            setSelectedPlan(null); // Create mode
                            setIsDialogOpen(true);
                        }
                    }
                ]}
            />

            {/* Warning for Non-God Mode Users */}
            {!isSuperAdmin && (
                <div className="status-warning p-4 rounded-[var(--radius)] flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <p className="text-sm font-bold uppercase">
                        Modo de Visualização: <span className="opacity-70">Apenas o Super Admin tem permissão de escrita.</span>
                    </p>
                </div>
            )}

            {plans.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-lg">
                    <AlertTriangle className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum plano encontrado no banco de dados.</p>
                    <p className="text-xs text-zinc-500 mt-2">Execute o script de migração no Banco SQL.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {plans.map((plan) => {
                    // Hide Enterprise plan for non-super admins
                    if (plan.id === 'plan_enterprise' && !isSuperAdmin) return null;

                    return (
                        <div key={plan.id} className="glass-dynamic p-6 flex flex-col relative group overflow-hidden transition-all duration-300 cursor-pointer rounded-[var(--radius)]">

                            {/* Plan Icon / Header */}
                            <div className="flex justify-between items-start mb-6 z-10 relative">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    {getPlanIcon(plan.icon_key, plan.accent_color)}
                                </div>
                                {plan.is_active ? (
                                    <Badge variant="outline" className="status-success">Ativo</Badge>
                                ) : (
                                    <Badge variant="outline" className="status-error">Inativo</Badge>
                                )}
                                {plan.is_visible === false && (
                                    <Badge variant="outline" className="ml-2 status-info opacity-70">
                                        <Eye className="w-3 h-3 mr-1" /> Oculto
                                    </Badge>
                                )}
                            </div>

                            {/* Title & Prices */}
                            <div className="mb-6 z-10 relative space-y-3">
                                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>

                                {/* Monthly */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-medium tracking-tight text-white">
                                        {formatCurrency(plan.monthly_price_amount || plan.price || 0)}
                                    </span>
                                    <span className="text-xs text-muted-foreground uppercase">/mês</span>
                                </div>

                                {/* Yearly */}
                                {(plan.yearly_price_amount || 0) > 0 && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                        <div className="flex items-baseline gap-1 opacity-80">
                                            <span className="text-sm font-medium text-white">
                                                {formatCurrency(plan.yearly_price_amount || 0)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase">/ano</span>
                                        </div>

                                        {(plan.monthly_price_amount || 0) > 0 && (
                                            <Badge variant="outline" className="h-5 px-1.5 status-success text-[10px] font-black">
                                                {Math.round((((plan.monthly_price_amount || 0) * 12 - (plan.yearly_price_amount || 0)) / ((plan.monthly_price_amount || 0) * 12)) * 100)}% OFF
                                            </Badge>
                                        )}
                                    </div>
                                )}

                            </div>

                            {/* Limits */}
                            <div className="space-y-3 mb-6 p-4 bg-black/20 rounded-lg border border-white/5 z-10 relative">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Usuários</span>
                                    <span className="font-bold text-white">
                                        {plan.max_users > 900 ? 'Ilimitado' : plan.max_users}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Conexões</span>
                                    <span className="font-bold text-white">
                                        {plan.max_connections > 900 ? 'Ilimitado' : plan.max_connections}
                                    </span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="flex-1 space-y-2 mb-6 z-10 relative">
                                {(plan.features || []).slice(0, 5).map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                                        <Check className="w-3.5 h-3.5 text-primary mt-0.5" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-4 border-t border-white/10 z-10 relative">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-xs font-bold uppercase transition-all"
                                    disabled={!isSuperAdmin}
                                    onClick={() => handleEditClick(plan)}
                                >
                                    {isSuperAdmin ? 'Editar Configurações' : 'Visualizar Detalhes'}
                                </Button>
                            </div>

                            {/* Decorative Background Glow */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
                        </div>
                    );
                })}
            </div>

            <UpdatePlanDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                plan={selectedPlan}
                onSuccess={fetchPlans}
            />
        </div>
    );
}
