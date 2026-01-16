import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plan } from "@/types/uniafy";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UpdatePlanDialogProps {
    plan: Plan | null; // null indicates "Create Mode"
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function UpdatePlanDialog({ plan, open, onOpenChange, onSuccess }: UpdatePlanDialogProps) {
    const [loading, setLoading] = useState(false);
    const [featuresInput, setFeaturesInput] = useState("");

    // Initialize form state when plan changes or dialog opens
    useEffect(() => {
        if (plan) {
            // Edit Mode: Load existing features as newline separated string
            setFeaturesInput(Array.isArray(plan.features) ? plan.features.join('\n') : '');
        } else {
            // Create Mode: Reset
            setFeaturesInput("");
        }
    }, [plan, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const monthlyPrice = parseFloat(formData.get("monthly_price") as string) || 0;
        const yearlyPrice = parseFloat(formData.get("yearly_price") as string) || 0;
        const max_users = parseInt(formData.get("max_users") as string) || 1;
        const max_connections = parseInt(formData.get("max_connections") as string) || 1;
        const is_active = formData.get("is_active") === "on";

        // Process features: modify lines, filter empty
        const featuresArray = featuresInput.split('\n').filter(line => line.trim() !== '');

        try {
            if (plan) {
                // --- UPDATE MODE ---
                const { error } = await supabase
                    .from('plans')
                    .update({
                        name,
                        description,
                        monthly_price_amount: monthlyPrice,
                        yearly_price_amount: yearlyPrice,
                        max_users,
                        max_connections,
                        features: featuresArray, // Save as JSONB array
                        is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', plan.id);

                if (error) throw error;
                toast.success("Plano atualizado com sucesso!");

            } else {
                // --- CREATE MODE ---
                // Validate ID format (basic check)
                if (!id.match(/^[a-z0-9_]+$/)) {
                    throw new Error("O ID deve conter apenas letras minúsculas, números e underline (ex: meu_plano_novo).");
                }

                // Auto-generate price IDs
                const monthly_price_id = `${id}_monthly`;
                const yearly_price_id = `${id}_yearly`;

                const { error } = await supabase
                    .from('plans')
                    .insert({
                        id,
                        name,
                        description,
                        monthly_price_id,
                        yearly_price_id,
                        monthly_price_amount: monthlyPrice,
                        yearly_price_amount: yearlyPrice,
                        features: featuresArray,
                        max_users,
                        max_connections,
                        is_active,
                        period: 'monthly'
                    });

                if (error) throw error;
                toast.success(`Plano '${name}' criado com sucesso!`);
            }

            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erro ao salvar plano.");
        } finally {
            setLoading(false);
        }
    };

    const isEditing = !!plan;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>{isEditing ? `Editar: ${plan.name}` : 'Criar Novo Plano'}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {isEditing
                            ? 'Atualize as configurações, limites e preços deste plano.'
                            : 'Configure um novo plano de assinatura. O ID será a chave única de referência.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">

                    <div className="grid grid-cols-2 gap-4">
                        {/* ID Field */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="id">ID do Plano (Slug) <span className="text-red-500">*</span></Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                                        <TooltipContent><p>Usado em webhooks e integrações. Imutável.</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Input
                                id="id"
                                name="id"
                                placeholder="ex: plan_gold"
                                defaultValue={plan?.id}
                                disabled={isEditing} // Cannot change ID on edit
                                className={`bg-zinc-900 border-white/10 font-mono text-sm ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                            />
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Visual <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="ex: Uniafy Gold"
                                defaultValue={plan?.name}
                                className="bg-zinc-900 border-white/10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição Curta</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="ex: Acesso completo para grandes agências"
                            defaultValue={plan?.description}
                            className="bg-zinc-900 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monthly_price">Preço Mensal (R$)</Label>
                            <Input
                                id="monthly_price"
                                name="monthly_price"
                                type="number"
                                step="0.01"
                                defaultValue={plan?.monthly_price_amount || 0}
                                className="bg-zinc-900 border-white/10"
                            />
                            {isEditing && <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {plan?.id}_monthly</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="yearly_price">Preço Anual (R$)</Label>
                            <div className="relative">
                                <Input
                                    id="yearly_price"
                                    name="yearly_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={plan?.yearly_price_amount || 0}
                                    className="bg-zinc-900 border-white/10 pr-16"
                                />
                                {plan && plan.monthly_price_amount && plan.monthly_price_amount > 0 && (
                                    <div className="absolute right-3 top-2.5 text-xs text-green-500 font-bold">
                                        {Math.round(((plan.monthly_price_amount * 12 - (plan.yearly_price_amount || 0)) / (plan.monthly_price_amount * 12)) * 100)}% OFF
                                    </div>
                                )}
                            </div>
                            {isEditing && <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {plan?.id}_yearly</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max_users">Máx. Usuários</Label>
                            <Input
                                id="max_users"
                                name="max_users"
                                type="number"
                                defaultValue={plan?.max_users || 1}
                                className="bg-zinc-900 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_connections">Máx. Conexões</Label>
                            <Input
                                id="max_connections"
                                name="max_connections"
                                type="number"
                                defaultValue={plan?.max_connections || 1}
                                className="bg-zinc-900 border-white/10"
                            />
                        </div>
                    </div>



                    {/* Features Input */}
                    <div className="space-y-2">
                        <Label htmlFor="features">
                            Funcionalidades (Features)
                            <span className="text-xs text-muted-foreground ml-2 font-normal">(Um item por linha)</span>
                        </Label>
                        <Textarea
                            id="features"
                            name="features"
                            placeholder="Gestão de Leads&#10;White Label&#10;Suporte 24h"
                            value={featuresInput}
                            onChange={(e) => setFeaturesInput(e.target.value)}
                            className="bg-zinc-900 border-white/10 min-h-[120px] font-mono text-sm leading-relaxed"
                        />
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="cursor-pointer font-bold">Plano Ativo</Label>
                            <div className="text-xs text-muted-foreground">Disponível para novas assinaturas</div>
                        </div>
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={plan?.is_active ?? true}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default" disabled={loading} className="min-w-[120px] bg-orange-600 hover:bg-orange-700 text-white">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? 'Salvar Edição' : 'Criar Plano'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
