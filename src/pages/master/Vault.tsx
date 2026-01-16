import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Save, Key, AlertTriangle, ShieldCheck } from 'lucide-react';
import { masterService } from '@/services/masterService';

export default function Vault() {
    const [loading, setLoading] = useState(true);
    const [secrets, setSecrets] = useState<any[]>([]);

    // Form States
    const [asaasKey, setAsaasKey] = useState('');
    const [asaasWebhook, setAsaasWebhook] = useState('');
    const [stripeKey, setStripeKey] = useState('');
    const [stripeWebhook, setStripeWebhook] = useState('');

    // Visibility Toggles
    const [showAsaasKey, setShowAsaasKey] = useState(false);
    const [showStripeKey, setShowStripeKey] = useState(false);

    useEffect(() => {
        loadSecrets();
    }, []);

    const loadSecrets = async () => {
        try {
            const data = await masterService.getVaultSecrets();
            setSecrets(data || []);

            // Populate Fields
            const findSecret = (provider: string, type: string) =>
                data?.find((s: any) => s.provider === provider && s.key_type === type)?.value || '';

            setAsaasKey(findSecret('asaas', 'api_key'));
            setAsaasWebhook(findSecret('asaas', 'webhook_token'));
            setStripeKey(findSecret('stripe', 'secret_key'));
            setStripeWebhook(findSecret('stripe', 'webhook_secret'));

        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar chaves do cofre.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await Promise.all([
                masterService.saveVaultSecret('asaas', 'api_key', asaasKey),
                masterService.saveVaultSecret('asaas', 'webhook_token', asaasWebhook),
                masterService.saveVaultSecret('stripe', 'secret_key', stripeKey),
                masterService.saveVaultSecret('stripe', 'webhook_secret', stripeWebhook),
            ]);
            toast.success("Cofre atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar chaves.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="COFRE DE"
                titleAccent="PAGAMENTOS"
                subtitle="Chaves e tokens sensíveis dos gateways de pagamento"
                action={
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Cofre
                    </Button>
                }
            />

            {/* Security Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-4">
                <div className="p-2 bg-yellow-500/20 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-wider mb-1">Ambiente Seguro</h4>
                    <p className="text-yellow-500/80 text-sm">
                        Todas as chaves são armazenadas no Supabase com permissões restritas (RLS).
                        Apenas administradores MESTRE têm acesso a esta área. Nunca compartilhe sua tela com terceiros nesta página.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* ASAAS CARD */}
                <Card className="bg-black/40 border-white/10 overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-blue-500/20 text-blue-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white tracking-wide">ASAAS</CardTitle>
                                <CardDescription className="text-zinc-400">Gateway brasileiro para PIX e Boleto automático.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                                API Key (Produção)
                                <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">Requerido</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showAsaasKey ? "text" : "password"}
                                    value={asaasKey}
                                    onChange={(e) => setAsaasKey(e.target.value)}
                                    className="bg-black/50 border-white/10 pl-10 pr-10 font-mono text-zinc-300"
                                    placeholder="as_..."
                                />
                                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <button
                                    onClick={() => setShowAsaasKey(!showAsaasKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                >
                                    {showAsaasKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Webhook Token (Opcional)</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={asaasWebhook}
                                    onChange={(e) => setAsaasWebhook(e.target.value)}
                                    className="bg-black/50 border-white/10 pl-10 font-mono text-zinc-300"
                                    placeholder="Token de validação..."
                                />
                                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* STRIPE CARD */}
                <Card className="bg-black/40 border-white/10 overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-purple-500/20 text-purple-400">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white tracking-wide">STRIPE</CardTitle>
                                <CardDescription className="text-zinc-400">Pagamentos internacionais com cartão de crédito.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                                Secret Key
                                <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">Requerido</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showStripeKey ? "text" : "password"}
                                    value={stripeKey}
                                    onChange={(e) => setStripeKey(e.target.value)}
                                    className="bg-black/50 border-white/10 pl-10 pr-10 font-mono text-zinc-300"
                                    placeholder="sk_live_..."
                                />
                                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <button
                                    onClick={() => setShowStripeKey(!showStripeKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                >
                                    {showStripeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Webhook Secret</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={stripeWebhook}
                                    onChange={(e) => setStripeWebhook(e.target.value)}
                                    className="bg-black/50 border-white/10 pl-10 font-mono text-zinc-300"
                                    placeholder="whsec_..."
                                />
                                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
