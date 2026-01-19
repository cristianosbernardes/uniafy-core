import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Save, Key, AlertTriangle, ShieldCheck, CreditCard, Flame, ChevronDown, CheckCircle2, Link } from 'lucide-react';
import { masterService } from '@/services/masterService';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPES ---
interface GatewayConfig {
    id: 'asaas' | 'stripe' | 'kiwify' | 'hotmart';
    name: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    secureColor: string;
}

// --- GATEWAY DEFINITIONS ---
const GATEWAYS: GatewayConfig[] = [
    {
        id: 'asaas',
        name: 'Asaas',
        description: 'Processador brasileiro para PIX e Boletos',
        icon: ShieldCheck,
        color: 'text-blue-500',
        gradient: 'from-blue-500/20 to-blue-600/5',
        secureColor: 'bg-blue-500'
    },
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Líder global em pagamentos por cartão',
        icon: CreditCard,
        color: 'text-purple-500',
        gradient: 'from-purple-500/20 to-purple-600/5',
        secureColor: 'bg-purple-500'
    },
    {
        id: 'kiwify',
        name: 'Kiwify',
        description: 'Plataforma para infoprodutos e cursos',
        icon: Key,
        color: 'text-green-500',
        gradient: 'from-green-500/20 to-green-600/5',
        secureColor: 'bg-green-500'
    },
    {
        id: 'hotmart',
        name: 'Hotmart',
        description: 'Maior plataforma de afiliados da AL',
        icon: Flame,
        color: 'text-orange-500',
        gradient: 'from-orange-500/20 to-orange-600/5',
        secureColor: 'bg-orange-500'
    }
];

export default function Vault() {
    const [loading, setLoading] = useState(true);
    const [activeGateway, setActiveGateway] = useState<string>('asaas');
    const [configId, setConfigId] = useState<string | null>(null);

    // Expansion State (Accordion)
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // Form States
    const [asaasKey, setAsaasKey] = useState('');
    const [asaasWebhook, setAsaasWebhook] = useState('');

    const [stripeKey, setStripeKey] = useState('');
    const [stripeWebhook, setStripeWebhook] = useState('');

    const [kiwifyToken, setKiwifyToken] = useState('');
    const [kiwifyWebhook, setKiwifyWebhook] = useState('');
    const [kiwifyAccountId, setKiwifyAccountId] = useState('');

    const [hotmartClientId, setHotmartClientId] = useState('');
    const [hotmartClientSecret, setHotmartClientSecret] = useState('');
    const [hotmartToken, setHotmartToken] = useState('');

    // Visibility Toggles
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

    const toggleShow = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleExpanded = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [secrets, config] = await Promise.all([
                masterService.getVaultSecrets(),
                masterService.getGlobalConfig()
            ]);

            // Set Global Config
            if (config) {
                setConfigId(config.id);
                setActiveGateway(config.active_gateway || 'asaas');
                // Auto expand active gateway initially
                if (config.active_gateway) {
                    setExpandedIds([config.active_gateway]);
                }
            }

            // Populate Fields
            const findSecret = (provider: string, type: string) =>
                secrets?.find((s: any) => s.provider === provider && s.key_type === type)?.value || '';

            setAsaasKey(findSecret('asaas', 'api_key'));
            setAsaasWebhook(findSecret('asaas', 'webhook_token'));

            setStripeKey(findSecret('stripe', 'secret_key'));
            setStripeWebhook(findSecret('stripe', 'webhook_secret'));

            setKiwifyToken(findSecret('kiwify', 'access_token'));
            setKiwifyWebhook(findSecret('kiwify', 'webhook_secret'));
            setKiwifyAccountId(findSecret('kiwify', 'account_id'));

            setHotmartClientId(findSecret('hotmart', 'client_id'));
            setHotmartClientSecret(findSecret('hotmart', 'client_secret'));
            setHotmartToken(findSecret('hotmart', 'hottok'));

        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados do cofre.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const promises = [
                // Asaas
                masterService.saveVaultSecret('asaas', 'api_key', asaasKey),
                masterService.saveVaultSecret('asaas', 'webhook_token', asaasWebhook),

                // Stripe
                masterService.saveVaultSecret('stripe', 'secret_key', stripeKey),
                masterService.saveVaultSecret('stripe', 'webhook_secret', stripeWebhook),

                // Kiwify
                masterService.saveVaultSecret('kiwify', 'access_token', kiwifyToken),
                masterService.saveVaultSecret('kiwify', 'webhook_secret', kiwifyWebhook),
                masterService.saveVaultSecret('kiwify', 'account_id', kiwifyAccountId),

                // Hotmart
                masterService.saveVaultSecret('hotmart', 'client_id', hotmartClientId),
                masterService.saveVaultSecret('hotmart', 'client_secret', hotmartClientSecret),
                masterService.saveVaultSecret('hotmart', 'hottok', hotmartToken),
            ];

            // Update Active Gateway if config exists
            if (configId) {
                const currentConfig = await masterService.getGlobalConfig();
                if (currentConfig) {
                    await masterService.updateGlobalConfig({
                        ...currentConfig,
                        active_gateway: activeGateway as any
                    });
                }
            }

            await Promise.all(promises);
            toast.success("Cofre e Gateway Ativo atualizados com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar alterações.");
        } finally {
            setLoading(false);
        }
    };

    // Helper check if configured
    const isConfigured = (id: string) => {
        if (id === 'asaas') return !!asaasKey;
        if (id === 'stripe') return !!stripeKey;
        if (id === 'kiwify') return !!kiwifyToken && !!kiwifyAccountId;
        if (id === 'hotmart') return !!hotmartClientId && !!hotmartClientSecret && !!hotmartToken;
        return false;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* HER0 - Fixed Context Header */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/5 p-8">
                {/* Subtle Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
                                Cofre <span className="text-orange-500">Master</span>
                            </h1>
                            <p className="text-zinc-400 text-sm font-medium">
                                Central de Segurança e Pagamentos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700 text-white border border-white/10 shadow-lg shadow-orange-900/20 transition-all font-bold uppercase tracking-wide h-10 px-6 rounded-lg"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Salvar Alterações
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* GATEWAY LIST */}
            <div className="grid gap-4">
                {GATEWAYS.map((gw) => {
                    const isOpen = expandedIds.includes(gw.id);
                    const isActive = activeGateway === gw.id;
                    const configured = isConfigured(gw.id);

                    return (
                        <motion.div
                            key={gw.id}
                            initial={false}
                            animate={{
                                backgroundColor: isOpen ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.4)',
                                borderColor: isActive ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255,255,255,0.05)'
                            }}
                            className={cn(
                                "group relative rounded-xl border overflow-hidden transition-all duration-300",
                                isActive && "ring-1 ring-orange-500/20 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 z-20" />
                            )}

                            {/* HEADER - Always Visible */}
                            <div
                                className="relative flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.01]"
                                onClick={() => toggleExpanded(gw.id)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-lg flex items-center justify-center border shadow-inner transition-colors",
                                        isActive ? `bg-white/5 border-white/10 ${gw.color}` : "bg-black/40 border-white/5 text-zinc-600"
                                    )}>
                                        <gw.icon className="w-6 h-6" />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={cn("text-lg font-bold uppercase tracking-wide", isActive ? "text-white" : "text-zinc-400")}>
                                                {gw.name}
                                            </h3>
                                            {configured && (
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-2 h-5">
                                                    Configurado
                                                </Badge>
                                            )}
                                            {isActive && (
                                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px] px-2 h-5">
                                                    Ativo
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-zinc-500 text-sm font-medium">
                                            {gw.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex flex-col items-end gap-1">
                                        <Label htmlFor={`switch-${gw.id}`} className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer">
                                            {isActive ? 'Ativado' : 'Desativado'}
                                        </Label>
                                        <Switch
                                            id={`switch-${gw.id}`}
                                            checked={isActive}
                                            onCheckedChange={(checked) => {
                                                if (checked) setActiveGateway(gw.id);
                                            }}
                                            className={cn(
                                                "data-[state=checked]:bg-orange-600",
                                                !isActive && "data-[state=unchecked]:bg-zinc-800"
                                            )}
                                        />
                                    </div>

                                    <div className="h-8 w-[1px] bg-white/5 mx-2" />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleExpanded(gw.id)}
                                        className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400"
                                    >
                                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                                    </Button>
                                </div>
                            </div>

                            {/* BODY - Accordion Content */}
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 border-t border-white/5 bg-black/20">
                                            <div className="grid gap-6 pt-6">
                                                {/* DYNAMIC FIELDS BASED ON ID */}

                                                {/* ASAAS */}
                                                {gw.id === 'asaas' && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">API Key (Produção)</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    type={showKeys['asaas_key'] ? "text" : "password"}
                                                                    value={asaasKey}
                                                                    onChange={e => setAsaasKey(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-blue-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                    placeholder="Ex: $aact_..."
                                                                />
                                                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                                                <button onClick={() => toggleShow('asaas_key')} className="absolute right-3 top-2.5 text-zinc-600 hover:text-zinc-400">
                                                                    {showKeys['asaas_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Webhook Token</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    value={asaasWebhook}
                                                                    onChange={e => setAsaasWebhook(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-blue-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                />
                                                                <Link className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* STRIPE */}
                                                {gw.id === 'stripe' && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Secret Key (Live)</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    type={showKeys['stripe_key'] ? "text" : "password"}
                                                                    value={stripeKey}
                                                                    onChange={e => setStripeKey(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-purple-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                    placeholder="Ex: sk_live_..."
                                                                />
                                                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                                                                <button onClick={() => toggleShow('stripe_key')} className="absolute right-3 top-2.5 text-zinc-600 hover:text-zinc-400">
                                                                    {showKeys['stripe_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Webhook Signing Secret</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    value={stripeWebhook}
                                                                    onChange={e => setStripeWebhook(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-purple-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                    placeholder="Ex: whsec_..."
                                                                />
                                                                <Link className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* KIWIFY */}
                                                {gw.id === 'kiwify' && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Access Token</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    type={showKeys['kiwify_key'] ? "text" : "password"}
                                                                    value={kiwifyToken}
                                                                    onChange={e => setKiwifyToken(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-green-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                />
                                                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                                                <button onClick={() => toggleShow('kiwify_key')} className="absolute right-3 top-2.5 text-zinc-600 hover:text-zinc-400">
                                                                    {showKeys['kiwify_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-zinc-400 uppercase tracking-wider">Account ID</Label>
                                                                <Input
                                                                    value={kiwifyAccountId}
                                                                    onChange={e => setKiwifyAccountId(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-green-500/50 transition-colors pl-3 h-10 font-mono text-sm"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-zinc-400 uppercase tracking-wider">Webhook Secret</Label>
                                                                <Input
                                                                    value={kiwifyWebhook}
                                                                    onChange={e => setKiwifyWebhook(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-green-500/50 transition-colors pl-3 h-10 font-mono text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* HOTMART */}
                                                {gw.id === 'hotmart' && (
                                                    <>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-zinc-400 uppercase tracking-wider">Client ID</Label>
                                                                <Input
                                                                    value={hotmartClientId}
                                                                    onChange={e => setHotmartClientId(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-orange-500/50 transition-colors pl-3 h-10 font-mono text-sm"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-zinc-400 uppercase tracking-wider">Client Secret</Label>
                                                                <div className="relative group">
                                                                    <Input
                                                                        type={showKeys['hotmart_secret'] ? "text" : "password"}
                                                                        value={hotmartClientSecret}
                                                                        onChange={e => setHotmartClientSecret(e.target.value)}
                                                                        className="bg-[#050505] border-white/10 focus:border-orange-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                    />
                                                                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                                                                    <button onClick={() => toggleShow('hotmart_secret')} className="absolute right-3 top-2.5 text-zinc-600 hover:text-zinc-400">
                                                                        {showKeys['hotmart_secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-zinc-400 uppercase tracking-wider">Webhook Token (Hottok)</Label>
                                                            <div className="relative group">
                                                                <Input
                                                                    value={hotmartToken}
                                                                    onChange={e => setHotmartToken(e.target.value)}
                                                                    className="bg-[#050505] border-white/10 focus:border-orange-500/50 transition-colors pl-10 h-10 font-mono text-sm"
                                                                />
                                                                <Link className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>


            {/* Security Footer */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                <AlertTriangle className="w-5 h-5 text-yellow-600/50 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Área de Segurança Máxima</h4>
                    <p className="text-xs text-zinc-500 max-w-3xl">
                        Estas credenciais dão acesso direto a transações financeiras. Nunca compartilhe sua tela com este módulo aberto se houver pessoas não autorizadas por perto.
                        A mudança de Gateway Principal interrompe imediatamente o processamento no provedor anterior para novas vendas.
                    </p>
                </div>
            </div>
        </div>
    );
}
