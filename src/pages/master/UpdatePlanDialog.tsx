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
import { Loader2, Plus, Trash2, HelpCircle, Zap, Eye } from "lucide-react";
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

    const [name, setName] = useState("");
    const [id, setId] = useState("");

    // Initialize form state when plan changes or dialog opens
    useEffect(() => {
        if (plan) {
            // Edit Mode: Load existing data
            setFeaturesInput(Array.isArray(plan.features) ? plan.features.join('\n') : '');
            setName(plan.name);
            setId(plan.id);
        } else {
            // Create Mode: Reset
            setFeaturesInput("");
            setName("");
            setId("");
        }
    }, [plan, open]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);

        // Auto-generate ID only in Create Mode
        if (!plan) {
            const slug = newName
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscore
                .replace(/^_+|_+$/g, ''); // Trim underscores

            setId(`plan_${slug}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        // Use state values or form data (controlled inputs are safer for visual sync)
        const finalId = id;
        const finalName = name;
        const description = formData.get("description") as string;
        const monthlyPrice = parseFloat(formData.get("monthly_price") as string) || 0;
        const yearlyPrice = parseFloat(formData.get("yearly_price") as string) || 0;
        const max_users = parseInt(formData.get("max_users") as string) || 1;
        const max_connections = parseInt(formData.get("max_connections") as string) || 1;
        const is_active = formData.get("is_active") === "on";
        const is_visible = formData.get("is_visible") === "on";

        // Process features: modify lines, filter empty
        const featuresArray = featuresInput.split('\n').filter(line => line.trim() !== '');

        try {
            if (plan) {
                // --- UPDATE MODE ---
                const { error } = await supabase
                    .from('plans')
                    .update({
                        name: finalName,
                        description,
                        monthly_price_amount: monthlyPrice,
                        yearly_price_amount: yearlyPrice,
                        max_users,
                        max_connections,
                        features: featuresArray, // Save as JSONB array
                        is_active,
                        is_visible,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', plan.id);

                if (error) throw error;
                toast.success("Plano atualizado com sucesso!");

            } else {
                // --- CREATE MODE ---
                // Validate ID format (basic check)
                if (!finalId.match(/^[a-z0-9_]+$/)) {
                    throw new Error("O ID deve conter apenas letras minúsculas, números e underline (ex: plan_gold).");
                }

                // Auto-generate price IDs
                const monthly_price_id = `${finalId}_monthly`;
                const yearly_price_id = `${finalId}_yearly`;

                const { error } = await supabase
                    .from('plans')
                    .insert({
                        id: finalId,
                        name: finalName,
                        description,
                        monthly_price_id,
                        yearly_price_id,
                        monthly_price_amount: monthlyPrice,
                        yearly_price_amount: yearlyPrice,
                        features: featuresArray,
                        max_users,
                        max_connections,
                        is_active,
                        is_visible,
                        period: 'monthly'
                    });

                if (error) throw error;
                toast.success(`Plano '${finalName}' criado com sucesso!`);
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
            <DialogContent className="bg-[#09090b] border-white/10 text-white p-0 gap-0 sm:max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {/* Premium Header */}
                    <div className="relative bg-zinc-950 p-8 overflow-hidden shrink-0">
                        {/* Background Architecture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600] to-[#E85D04] opacity-100"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/40 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                {/* Icon Container */}
                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <DialogTitle className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                                            {isEditing ? 'Editar Plano' : 'Novo Plano'}
                                        </DialogTitle>
                                    </div>
                                    <DialogDescription className="text-orange-50 font-medium text-sm">
                                        {isEditing ? 'Atualize as regras e limites deste plano.' : 'Configure um novo plano de assinatura.'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name & ID Grid - Fixed Alignment */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 h-5">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Nome Visual <span className="text-red-500">*</span></Label>
                                    </div>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="bg-black/40 border-white/10 text-white h-10 focus:border-orange-500/50 transition-colors"
                                        placeholder="ex: Uniafy Gold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 h-5">
                                        <Label htmlFor="id" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">ID do Plano</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><HelpCircle className="w-3 h-3 text-zinc-500 hover:text-white transition-colors" /></TooltipTrigger>
                                                <TooltipContent><p>Slug único usado pelo sistema. Imutável após criação.</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Input
                                        id="id"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className={`bg-black/40 border-white/10 text-zinc-400 h-10 font-mono text-xs ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        placeholder="plan_..."
                                        disabled={isEditing}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Descrição Curta</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={plan?.description || ''}
                                    className="bg-black/40 border-white/10 text-white h-10"
                                    placeholder="ex: Acesso completo para grandes agências"
                                />
                            </div>

                            {/* Prices Grid */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_price_amount" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Preço Mensal (R$)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">R$</span>
                                        <Input
                                            id="monthly_price_amount"
                                            name="monthly_price_amount"
                                            type="number"
                                            step="0.01"
                                            defaultValue={plan?.monthly_price_amount || 0}
                                            className="bg-black/40 border-white/10 text-white h-10 pl-8 font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearly_price_amount" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Preço Anual (R$)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">R$</span>
                                        <Input
                                            id="yearly_price_amount"
                                            name="yearly_price_amount"
                                            type="number"
                                            step="0.01"
                                            defaultValue={plan?.yearly_price_amount || 0}
                                            className="bg-black/40 border-white/10 text-white h-10 pl-8 font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Limits Grid */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="max_users" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Máx. Usuários</Label>
                                    <Input
                                        id="max_users"
                                        name="max_users"
                                        type="number"
                                        defaultValue={plan?.max_users || 1}
                                        className="bg-black/40 border-white/10 text-white h-10 font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_connections" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Máx. Conexões</Label>
                                    <Input
                                        id="max_connections"
                                        name="max_connections"
                                        type="number"
                                        defaultValue={plan?.max_connections || 1}
                                        className="bg-black/40 border-white/10 text-white h-10 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2">
                                <Label htmlFor="features" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                                    Funcionalidades
                                    <span className="text-[10px] text-zinc-500 normal-case ml-2 font-normal">(Um item por linha)</span>
                                </Label>
                                <Textarea
                                    id="features"
                                    value={featuresInput}
                                    onChange={(e) => setFeaturesInput(e.target.value)}
                                    className="bg-black/40 border-white/10 text-white min-h-[100px] font-mono text-xs leading-relaxed custom-scrollbar focus:border-orange-500/50 transition-colors"
                                    placeholder="Gestão de Leads&#10;White Label&#10;Suporte 24h"
                                />
                            </div>

                            {/* Toggles Container - Premium Card Style */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_active" className="cursor-pointer text-xs font-bold flex items-center gap-2 text-white group-hover:text-green-400 transition-colors">
                                            <Zap className="w-3.5 h-3.5 text-green-500" /> Ativo
                                        </Label>
                                        <div className="text-[10px] text-zinc-500">Aceita novas assinaturas?</div>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked={plan?.is_active ?? true}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_visible" className="cursor-pointer text-xs font-bold flex items-center gap-2 text-white group-hover:text-blue-400 transition-colors">
                                            <Eye className="w-3.5 h-3.5 text-blue-500" /> Visível
                                        </Label>
                                        <div className="text-[10px] text-zinc-500">Exibir na vitrine pública?</div>
                                    </div>
                                    <Switch
                                        id="is_visible"
                                        name="is_visible"
                                        defaultChecked={plan?.is_visible ?? true}
                                        className="data-[state=checked]:bg-blue-500"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-6 border-t border-white/5 gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={loading}
                                    className="hover:bg-white/5 text-zinc-400 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white font-bold px-8 shadow-lg shadow-orange-500/20"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isEditing ? 'Salvar Alterações' : 'Criar Plano'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
