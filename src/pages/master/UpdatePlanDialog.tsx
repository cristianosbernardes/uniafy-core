import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plan } from "@/types/uniafy";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, HelpCircle, Zap, CreditCard, Star, Globe, Shield, Database, Layout, Palette, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FeatureList } from "@/components/FeatureList";
import { cn } from "@/lib/utils";

interface UpdatePlanDialogProps {
    plan: Plan | null; // null indicates "Create Mode"
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const AVAILABLE_ICONS = [
    { key: 'Zap', icon: Zap, label: 'Raio' },
    { key: 'Star', icon: Star, label: 'Estrela' },
    { key: 'Globe', icon: Globe, label: 'Globo' },
    { key: 'Shield', icon: Shield, label: 'Escudo' },
    { key: 'Database', icon: Database, label: 'Banco' },
    { key: 'Layout', icon: Layout, label: 'Layout' },
];

const AVAILABLE_COLORS = [
    { key: '#FF6600', label: 'Laranja (Uniafy)', class: 'bg-[#FF6600]' },
    { key: '#3B82F6', label: 'Azul', class: 'bg-blue-500' },
    { key: '#A855F7', label: 'Roxo', class: 'bg-purple-500' },
    { key: '#EF4444', label: 'Vermelho', class: 'bg-red-500' },
    { key: '#10B981', label: 'Verde', class: 'bg-emerald-500' },
    { key: '#EC4899', label: 'Rosa', class: 'bg-pink-500' },
];

export function UpdatePlanDialog({ plan, open, onOpenChange, onSuccess }: UpdatePlanDialogProps) {
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [features, setFeatures] = useState<string[]>([]);

    // Visual States
    const [iconKey, setIconKey] = useState("Zap");
    const [accentColor, setAccentColor] = useState("#FF6600");

    // Initialize form state when plan changes or dialog opens
    useEffect(() => {
        if (plan) {
            // Edit Mode: Load existing data
            setName(plan.name);
            setId(plan.id);
            setFeatures(Array.isArray(plan.features) ? plan.features : []);
            setIconKey(plan.icon_key || "Zap");
            setAccentColor(plan.accent_color || "#FF6600");
        } else {
            // Create Mode: Reset
            setName("");
            setId("");
            setFeatures([]);
            setIconKey("Zap");
            setAccentColor("#FF6600");
        }
    }, [plan, open]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);

        // Auto-generate ID only in Create Mode
        if (!plan) {
            const slug = newName
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');

            setId(`plan_${slug}`);
        }
    };

    const validateGateways = (data: FormData) => {
        const stripeM = data.get("stripe_id_monthly") as string;

        if (stripeM && !stripeM.startsWith("price_") && !stripeM.startsWith("prod_")) {
            // Warning only, don't block
            toast.warning("ID do Stripe geralmente começa com 'price_' ou 'prod_'. Verifique se está correto.");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const finalId = id;
        const finalName = name;
        const description = formData.get("description") as string;
        const monthlyPrice = parseFloat(formData.get("monthly_price_amount") as string) || 0;
        const yearlyPrice = parseFloat(formData.get("yearly_price_amount") as string) || 0;
        const max_users = parseInt(formData.get("max_users") as string) || 1;
        const max_connections = parseInt(formData.get("max_connections") as string) || 1;

        // Multi-Gateway IDs
        const kiwify_id_monthly = formData.get("kiwify_id_monthly") as string;
        const kiwify_id_yearly = formData.get("kiwify_id_yearly") as string;
        const stripe_id_monthly = formData.get("stripe_id_monthly") as string;
        const stripe_id_yearly = formData.get("stripe_id_yearly") as string;
        const asaas_id_monthly = formData.get("asaas_id_monthly") as string;
        const asaas_id_yearly = formData.get("asaas_id_yearly") as string;
        const hotmart_id_monthly = formData.get("hotmart_id_monthly") as string;
        const hotmart_id_yearly = formData.get("hotmart_id_yearly") as string;

        const is_active = formData.get("is_active") === "on";
        const is_visible = formData.get("is_visible") === "on";

        // Pre-validation
        validateGateways(formData);

        try {
            const commonData = {
                name: finalName,
                description,
                monthly_price_amount: monthlyPrice,
                yearly_price_amount: yearlyPrice,
                max_users,
                max_connections,

                // IDs
                kiwify_id_monthly, kiwify_id_yearly,
                stripe_id_monthly, stripe_id_yearly,
                asaas_id_monthly, asaas_id_yearly,
                hotmart_id_monthly, hotmart_id_yearly,
                // Legacy
                gateway_id_monthly: kiwify_id_monthly,
                gateway_id_yearly: kiwify_id_yearly,

                // Visuals & Features
                features: features.filter(f => f.trim() !== ''),
                icon_key: iconKey,
                accent_color: accentColor,

                is_active,
                is_visible,
            };

            if (plan) {
                // UPDATE
                const { error } = await supabase
                    .from('plans')
                    .update({
                        ...commonData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', plan.id);

                if (error) throw error;
                toast.success("Plano atualizado com sucesso!");

            } else {
                // CREATE
                if (!finalId.match(/^[a-z0-9_]+$/)) {
                    throw new Error("O ID deve conter apenas letras minúsculas, números e underline.");
                }

                const { error } = await supabase
                    .from('plans')
                    .insert({
                        id: finalId,
                        monthly_price_id: `${finalId}_monthly`,
                        yearly_price_id: `${finalId}_yearly`,
                        period: 'monthly',
                        ...commonData
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

    // Helper to get Icon Component
    const SelectedIcon = AVAILABLE_ICONS.find(i => i.key === iconKey)?.icon || Zap;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#09090b] border-white/20 shadow-2xl text-white p-0 gap-0 sm:max-w-[900px] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {/* Visual Header - Dynamic Color */}
                    <div className="relative p-8 overflow-hidden shrink-0 transition-colors duration-500"
                        style={{ backgroundColor: '#09090b' }}
                    >
                        {/* Dynamic Background Gradients */}
                        <div className="absolute inset-0 opacity-40 transition-colors duration-500"
                            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, transparent 100%)` }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                {/* Dynamic Icon Container */}
                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                                    <SelectedIcon className="w-8 h-8 text-white drop-shadow-md" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <DialogTitle className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                                            {isEditing ? 'Editar Plano' : 'Novo Plano'}
                                        </DialogTitle>
                                    </div>
                                    <DialogDescription className="text-white/80 font-medium text-sm">
                                        {isEditing ? 'Atualize as regras e identidade deste plano.' : 'Configure um novo plano de assinatura.'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: Main Form */}
                        <div className="lg:col-span-8 space-y-6">
                            <form id="plan-form" onSubmit={handleSubmit} className="space-y-6">

                                {/* --- DADOS BÁSICOS --- */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Nome Visual <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={handleNameChange}
                                            className="bg-black/40 border-white/20 text-white h-10 focus:border-white/40 transition-colors"
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
                                                    <TooltipContent><p>Slug único. Imutável após criação.</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            id="id"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            className={`bg-black/40 border-white/20 text-zinc-400 h-10 font-mono text-xs ${isEditing ? 'cursor-not-allowed' : ''}`}
                                            placeholder="plan_..."
                                            disabled={isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Descrição Curta</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        defaultValue={plan?.description || ''}
                                        className="bg-black/40 border-white/20 text-white h-10"
                                        placeholder="ex: Acesso para grandes agências"
                                    />
                                </div>

                                {/* --- GATEWAY INTEGRATION --- */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5" /> Integração de Pagamentos
                                    </Label>
                                    <Tabs defaultValue="kiwify" className="w-full">
                                        <TabsList className="bg-black/40 border border-white/20 w-full justify-start h-10 p-1">
                                            <TabsTrigger value="kiwify" className="data-[state=active]:bg-[#2ECFA0] data-[state=active]:text-black text-[10px] font-bold uppercase h-8">Kiwify</TabsTrigger>
                                            <TabsTrigger value="stripe" className="data-[state=active]:bg-[#635BFF] data-[state=active]:text-white text-[10px] font-bold uppercase h-8">Stripe</TabsTrigger>
                                            <TabsTrigger value="asaas" className="data-[state=active]:bg-[#0030b9] data-[state=active]:text-white text-[10px] font-bold uppercase h-8">Asaas</TabsTrigger>
                                            <TabsTrigger value="hotmart" className="data-[state=active]:bg-[#F04E23] data-[state=active]:text-white text-[10px] font-bold uppercase h-8">Hotmart</TabsTrigger>
                                        </TabsList>

                                        {/* KIWIFY */}
                                        <TabsContent value="kiwify" className="mt-3 space-y-3 p-3 rounded-lg border border-[#2ECFA0]/20 bg-[#2ECFA0]/5">
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#2ECFA0]">ID (Mensal)</Label>
                                                    <Input name="kiwify_id_monthly" defaultValue={plan?.kiwify_id_monthly || plan?.gateway_id_monthly || ''} className="bg-black/50 border-[#2ECFA0]/30 font-mono text-xs h-8" placeholder="ex: myODptT" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#2ECFA0]">ID (Anual)</Label>
                                                    <Input name="kiwify_id_yearly" defaultValue={plan?.kiwify_id_yearly || plan?.gateway_id_yearly || ''} className="bg-black/50 border-[#2ECFA0]/30 font-mono text-xs h-8" placeholder="ex: YearID" />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* STRIPE */}
                                        <TabsContent value="stripe" className="mt-3 space-y-3 p-3 rounded-lg border border-[#635BFF]/20 bg-[#635BFF]/5">
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#635BFF]">ID (Mensal)</Label>
                                                    <Input name="stripe_id_monthly" defaultValue={plan?.stripe_id_monthly || ''} className="bg-black/50 border-[#635BFF]/30 font-mono text-xs h-8" placeholder="price_..." />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#635BFF]">ID (Anual)</Label>
                                                    <Input name="stripe_id_yearly" defaultValue={plan?.stripe_id_yearly || ''} className="bg-black/50 border-[#635BFF]/30 font-mono text-xs h-8" placeholder="price_..." />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* ASAAS */}
                                        <TabsContent value="asaas" className="mt-3 space-y-3 p-3 rounded-lg border border-[#0030b9]/20 bg-[#0030b9]/5">
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#0030b9]">ID (Mensal)</Label>
                                                    <Input name="asaas_id_monthly" defaultValue={plan?.asaas_id_monthly || ''} className="bg-black/50 border-[#0030b9]/30 font-mono text-xs h-8" placeholder="UUID" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#0030b9]">ID (Anual)</Label>
                                                    <Input name="asaas_id_yearly" defaultValue={plan?.asaas_id_yearly || ''} className="bg-black/50 border-[#0030b9]/30 font-mono text-xs h-8" placeholder="UUID" />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* HOTMART */}
                                        <TabsContent value="hotmart" className="mt-3 space-y-3 p-3 rounded-lg border border-[#F04E23]/20 bg-[#F04E23]/5">
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#F04E23]">ID (Mensal)</Label>
                                                    <Input name="hotmart_id_monthly" defaultValue={plan?.hotmart_id_monthly || ''} className="bg-black/50 border-[#F04E23]/30 font-mono text-xs h-8" placeholder="Code" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] font-bold text-[#F04E23]">ID (Anual)</Label>
                                                    <Input name="hotmart_id_yearly" defaultValue={plan?.hotmart_id_yearly || ''} className="bg-black/50 border-[#F04E23]/30 font-mono text-xs h-8" placeholder="Code" />
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                {/* FEATURES DYNAMIC */}
                                <FeatureList features={features} onChange={setFeatures} />

                            </form>
                        </div>

                        {/* RIGHT COLUMN: Settings & Visuals */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Visual Identity */}
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-5">
                                <Label className="text-xs font-bold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                                    <Palette className="w-3.5 h-3.5" /> Identidade Visual
                                </Label>

                                {/* Icon Picker */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase">Ícone do Card</Label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {AVAILABLE_ICONS.map(({ key, icon: Icon }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setIconKey(key)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all border",
                                                    iconKey === key
                                                        ? "bg-white/20 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                                        : "bg-black/20 border-transparent text-zinc-500 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Picker */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase">Cor de Destaque</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_COLORS.map(({ key, class: bgClass }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setAccentColor(key)}
                                                className={cn(
                                                    "w-6 h-6 rounded-full transition-all border-2",
                                                    bgClass,
                                                    accentColor === key
                                                        ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                                        : "border-transparent opacity-50 hover:opacity-100"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Prices & Limits Compact */}
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Regras & Limites</Label>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500">Valor Mensal</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">R$</span>
                                            <Input form="plan-form" name="monthly_price_amount" type="number" step="0.01" defaultValue={plan?.monthly_price_amount || 0} className="bg-black/40 border-white/20 text-white h-8 pl-6 font-mono text-xs" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500">Valor Anual</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">R$</span>
                                            <Input form="plan-form" name="yearly_price_amount" type="number" step="0.01" defaultValue={plan?.yearly_price_amount || 0} className="bg-black/40 border-white/20 text-white h-8 pl-6 font-mono text-xs" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500">Máx. Usuários</Label>
                                        <Input form="plan-form" name="max_users" type="number" defaultValue={plan?.max_users || 1} className="bg-black/40 border-white/20 text-white h-8 font-mono text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500">Máx. Conexões</Label>
                                        <Input form="plan-form" name="max_connections" type="number" defaultValue={plan?.max_connections || 1} className="bg-black/40 border-white/20 text-white h-8 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-2 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between p-2 rounded-lg border border-white/10 bg-white/5">
                                    <Label htmlFor="is_active" className="cursor-pointer text-xs font-bold flex items-center gap-2 text-white">
                                        <Zap className="w-3.5 h-3.5 text-green-500" /> Ativo
                                    </Label>
                                    <Switch form="plan-form" id="is_active" name="is_active" defaultChecked={plan?.is_active ?? true} className="scale-75 data-[state=checked]:bg-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg border border-white/10 bg-white/5">
                                    <Label htmlFor="is_visible" className="cursor-pointer text-xs font-bold flex items-center gap-2 text-white">
                                        <Eye className="w-3.5 h-3.5 text-blue-500" /> Visível
                                    </Label>
                                    <Switch form="plan-form" id="is_visible" name="is_visible" defaultChecked={plan?.is_visible ?? true} className="scale-75 data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-[#09090b] border-t border-white/10">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="text-zinc-400 hover:text-white">Cancelar</Button>
                    <Button form="plan-form" type="submit" disabled={loading} className="bg-white/10 hover:bg-white/20 text-white font-bold" style={{ backgroundColor: accentColor }}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {isEditing ? 'Salvar Alterações' : 'Criar Plano'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
