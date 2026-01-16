import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar, CreditCard, Download, Shield, Star, Zap, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { agencyService } from '@/services/agencyService';
import { masterService } from '@/services/masterService';
import { Plan } from '@/types/uniafy';
import { toast } from 'sonner';

export default function AgencyFinance() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);

    // Upgrade State
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (!user) return;
            const [subData, invData, plansData] = await Promise.all([
                agencyService.getMySubscription(user.id),
                agencyService.getInvoices(user.id),
                masterService.getPlans()
            ]);
            setSubscription(subData);
            setInvoices(invData || []);
            setPlans(plansData);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados financeiros.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async () => {
        if (!user || !selectedPlanId) return;
        setProcessing(true);
        try {
            const plan = plans.find(p => p.id === selectedPlanId);
            if (!plan) return;

            await agencyService.subscribePlan(user.id, plan.id, plan.monthly_price_amount);

            toast.success("Pagamento aprovado! Plano atualizado com sucesso.");
            setIsUpgradeOpen(false);
            await loadData(); // Refresh UI
        } catch (error) {
            toast.error("Erro ao processar pagamento simulado.");
        } finally {
            setProcessing(false);
        }
    };

    const getDaysRemaining = () => {
        if (!subscription?.trial_end) return 0;
        const end = new Date(subscription.trial_end);
        const now = new Date();
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Fallback: Se o Join falhar (data mismatch), tenta buscar o plano na lista carregada
    const joinedPlan = subscription?.plan;
    const localFallbackPlan = plans.find(p => p.id === subscription?.plan_id);

    // DEBUG MATCHING
    if (!joinedPlan && !localFallbackPlan && subscription) {
        console.warn("PLAN MISMATCH DEBUG:", {
            subPlanId: subscription.plan_id,
            availablePlans: plans.map(p => ({ id: p.id, name: p.name }))
        });
    }

    const currentPlan = joinedPlan || localFallbackPlan || { name: 'Sem Plano' };
    const isTrial = subscription?.status === 'trial';

    return (
        <div className="space-y-8">
            <PageHeader
                title="MEU"
                titleAccent="FINANCEIRO"
                subtitle="Gerencie sua assinatura e faturas"
            />

            {/* STATUS DA ASSINATURA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-gradient-to-br from-black to-zinc-900 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-4 h-4 text-primary" />
                            Plano Atual
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-1 uppercase">
                                    {currentPlan.name || 'Sem Plano'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge variant={isTrial ? 'outline' : 'default'} className={isTrial ? "text-yellow-500 border-yellow-500/50" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"}>
                                        {isTrial ? 'Período de Testes (Trial)' : 'Assinatura Ativa'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Renova em {new Date(subscription?.current_period_end || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="font-bold uppercase shadow-lg shadow-primary/20 animate-pulse hover:animate-none"
                                onClick={() => setIsUpgradeOpen(true)}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Fazer Upgrade
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Método de Pagamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                <span className="text-[10px] font-black text-black">VISA</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">•••• 4242</p>
                                <p className="text-[10px] text-muted-foreground">Expira em 12/28</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs border-white/10 hover:bg-white/5">
                            Alterar Cartão
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* CONSUMO (Barra de Progresso) */}
            <Card className="bg-black/40 border-white/10">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-white uppercase">Consumo do Plano</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Usuários da Equipe</span>
                            <span className="font-bold text-white">3 / {currentPlan.max_users || 10}</span>
                        </div>
                        <Progress value={30} className="h-2 bg-white/5 [&>div]:bg-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Conexões Ativas</span>
                            <span className="font-bold text-white">1 / {currentPlan.max_connections || 5}</span>
                        </div>
                        <Progress value={20} className="h-2 bg-white/5 [&>div]:bg-purple-500" />
                    </div>
                </CardContent>
            </Card>

            {/* HISTÓRICO DE FATURAS */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Histórico de Faturas
                </h3>
                <div className="glass-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-xs font-bold uppercase text-muted-foreground">Data</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-muted-foreground">Descrição</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-muted-foreground">Valor</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase text-muted-foreground">Recibo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                                        Nenhuma fatura encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                            {invoices.map((inv) => (
                                <TableRow key={inv.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-mono text-xs text-zinc-300">
                                        {new Date(inv.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-white">
                                        {inv.description || `Mensalidade ${currentPlan.name}`}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-zinc-300">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] uppercase font-bold">
                                            {inv.status === 'paid' ? 'Pago' : inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* UPGRADE DIALOG */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="max-w-4xl bg-zinc-950 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase text-center">Escolha seu Plano</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Desbloqueie todo o poder da Uniafy agora mesmo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                        {plans.filter(p => p.id !== 'plan_enterprise').map(plan => (
                            <div
                                key={plan.id}
                                className={`
                                    relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95
                                    ${selectedPlanId === plan.id ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5 hover:border-white/20'}
                                `}
                                onClick={() => setSelectedPlanId(plan.id)}
                            >
                                {plan.id === 'plan_scale' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                        Mais Popular
                                    </div>
                                )}
                                <h4 className="text-lg font-bold text-white text-center mb-2">{plan.name}</h4>
                                <div className="text-center mb-4">
                                    <span className="text-2xl font-black text-white">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.monthly_price_amount)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">/mês</span>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {(plan.features || []).slice(0, 4).map((feat: any, i: number) => (
                                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex-col sm:flex-col gap-2">
                        <Button
                            className="w-full h-12 text-lg font-black uppercase bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20"
                            disabled={!selectedPlanId || processing}
                            onClick={handleUpgrade}
                        >
                            {processing ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando Pagamento...</>
                            ) : (
                                <><Shield className="w-5 h-5 mr-2" /> Confirmar Assinatura e Pagar</>
                            )}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" /> Pagamento 100% seguro via Stripe/Asaas (Simulado)
                        </p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
