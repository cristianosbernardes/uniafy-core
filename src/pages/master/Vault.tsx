import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Save, Key, AlertTriangle, ShieldCheck, CreditCard, Flame, Link } from 'lucide-react';
import { masterService } from '@/services/masterService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from '@/components/ui/badge';

export default function Vault() {
    const [loading, setLoading] = useState(true);
    const [activeGateway, setActiveGateway] = useState<string>('asaas');
    const [configId, setConfigId] = useState<string | null>(null);

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="COFRE"
                titleAccent="MULTI-GATEWAY"
                subtitle="Gerencie chaves e defina o processador ativo de pagamentos"
                action={
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide shadow-lg shadow-red-900/20"
                    >
                        {loading ? 'Salvando...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Salvar Tudo
                            </>
                        )}
                    </Button>
                }
            />

            {/* Active Gateway Selector */}
            <Card className="bg-[#111] border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-emerald-500/20 text-emerald-400">
                            <Link className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold text-white uppercase tracking-wide">Gateway Principal (Ativo)</CardTitle>
                            <CardDescription className="text-zinc-400 text-xs">Escolha qual provedor processará os novos pagamentos.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <RadioGroup
                        value={activeGateway}
                        onValueChange={setActiveGateway}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {[
                            { id: 'asaas', name: 'Asaas', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/50' },
                            { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/50' },
                            { id: 'kiwify', name: 'Kiwify', icon: Key, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/50' },
                            { id: 'hotmart', name: 'Hotmart', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/50' }
                        ].map((gw) => (
                            <div key={gw.id}>
                                <RadioGroupItem value={gw.id} id={gw.id} className="peer sr-only" />
                                <Label
                                    htmlFor={gw.id}
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-white/5 bg-black/40 p-4 hover:bg-white/5 hover:text-white peer-data-[state=checked]:${gw.bg} [&:has([data-state=checked])]:${gw.bg} cursor-pointer transition-all h-24`}
                                >
                                    <gw.icon className={`mb-2 h-6 w-6 ${gw.color}`} />
                                    <span className="text-sm font-bold uppercase tracking-wider">{gw.name}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <Tabs defaultValue="asaas" className="w-full">
                <TabsList className="w-full justify-start bg-black/40 border border-white/10 p-1 h-auto mb-6 overflow-x-auto">
                    <TabsTrigger value="asaas" className="uppercase text-xs font-bold px-6 py-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Asaas</TabsTrigger>
                    <TabsTrigger value="stripe" className="uppercase text-xs font-bold px-6 py-2 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400">Stripe</TabsTrigger>
                    <TabsTrigger value="kiwify" className="uppercase text-xs font-bold px-6 py-2 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">Kiwify</TabsTrigger>
                    <TabsTrigger value="hotmart" className="uppercase text-xs font-bold px-6 py-2 data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-400">Hotmart</TabsTrigger>
                </TabsList>

                {/* ASAAS CONTENT */}
                <TabsContent value="asaas">
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-blue-500 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Configuração Asaas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>API Key (Produção)</Label>
                                <div className="relative">
                                    <Input
                                        type={showKeys['asaas_key'] ? "text" : "password"}
                                        value={asaasKey}
                                        onChange={e => setAsaasKey(e.target.value)}
                                        className="bg-black/50 border-white/10 pr-10"
                                    />
                                    <button onClick={() => toggleShow('asaas_key')} className="absolute right-3 top-2.5 text-zinc-500">
                                        {showKeys['asaas_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Webhook Token</Label>
                                <Input value={asaasWebhook} onChange={e => setAsaasWebhook(e.target.value)} className="bg-black/50 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* STRIPE CONTENT */}
                <TabsContent value="stripe">
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-purple-500 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Configuração Stripe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Secret Key (sk_live)</Label>
                                <div className="relative">
                                    <Input
                                        type={showKeys['stripe_key'] ? "text" : "password"}
                                        value={stripeKey}
                                        onChange={e => setStripeKey(e.target.value)}
                                        className="bg-black/50 border-white/10 pr-10"
                                    />
                                    <button onClick={() => toggleShow('stripe_key')} className="absolute right-3 top-2.5 text-zinc-500">
                                        {showKeys['stripe_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Webhook Signing Secret (whsec)</Label>
                                <Input value={stripeWebhook} onChange={e => setStripeWebhook(e.target.value)} className="bg-black/50 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* KIWIFY CONTENT */}
                <TabsContent value="kiwify">
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-green-500 flex items-center gap-2"><Key className="w-5 h-5" /> Configuração Kiwify</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Access Token</Label>
                                <div className="relative">
                                    <Input
                                        type={showKeys['kiwify_key'] ? "text" : "password"}
                                        value={kiwifyToken}
                                        onChange={e => setKiwifyToken(e.target.value)}
                                        className="bg-black/50 border-white/10 pr-10"
                                        placeholder="Bearer Token..."
                                    />
                                    <button onClick={() => toggleShow('kiwify_key')} className="absolute right-3 top-2.5 text-zinc-500">
                                        {showKeys['kiwify_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Account ID (Opcional)</Label>
                                <Input value={kiwifyAccountId} onChange={e => setKiwifyAccountId(e.target.value)} className="bg-black/50 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Webhook App Token</Label>
                                <Input value={kiwifyWebhook} onChange={e => setKiwifyWebhook(e.target.value)} className="bg-black/50 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HOTMART CONTENT */}
                <TabsContent value="hotmart">
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-orange-500 flex items-center gap-2"><Flame className="w-5 h-5" /> Configuração Hotmart</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Client ID</Label>
                                    <Input value={hotmartClientId} onChange={e => setHotmartClientId(e.target.value)} className="bg-black/50 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client Secret</Label>
                                    <div className="relative">
                                        <Input
                                            type={showKeys['hotmart_secret'] ? "text" : "password"}
                                            value={hotmartClientSecret}
                                            onChange={e => setHotmartClientSecret(e.target.value)}
                                            className="bg-black/50 border-white/10 pr-10"
                                        />
                                        <button onClick={() => toggleShow('hotmart_secret')} className="absolute right-3 top-2.5 text-zinc-500">
                                            {showKeys['hotmart_secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Webhook Token (Hottok)</Label>
                                <Input value={hotmartToken} onChange={e => setHotmartToken(e.target.value)} className="bg-black/50 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-4 flex items-start gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                    <h4 className="text-yellow-500 font-bold text-xs uppercase tracking-wider mb-1">Área de Altíssima Segurança</h4>
                    <p className="text-yellow-500/60 text-xs text-balance">
                        As chaves abaixo concedem acesso financeiro total à sua operação.
                        Certifique-se de que apenas o MESTRE tem acesso a esta página.
                        A troca de <strong>Gateway Principal</strong> afeta imediatamente o checkout de novos clientes.
                    </p>
                </div>
            </div>
        </div>
    );
}
