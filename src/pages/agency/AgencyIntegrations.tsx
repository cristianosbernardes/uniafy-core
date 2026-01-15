
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, RefreshCw, Link2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AgencyIntegrations() {
    const [connections, setConnections] = useState({
        meta: { connected: false, loading: false, accountName: '' },
        google: { connected: false, loading: false, accountName: '' }
    });

    const handleConnect = (platform: 'meta' | 'google') => {
        setConnections(prev => ({
            ...prev,
            [platform]: { ...prev[platform], loading: true }
        }));

        // Simulação de OAuth
        setTimeout(() => {
            setConnections(prev => ({
                ...prev,
                [platform]: {
                    connected: true,
                    loading: false,
                    accountName: platform === 'meta' ? 'Agência Uniafy Business' : 'Uniafy MCC'
                }
            }));
            toast.success(`Conexão com ${platform === 'meta' ? 'Meta Ads' : 'Google Ads'} realizada com sucesso!`);
        }, 2000);
    };

    const handleDisconnect = (platform: 'meta' | 'google') => {
        setConnections(prev => ({
            ...prev,
            [platform]: { connected: false, loading: false, accountName: '' }
        }));
        toast.info(`Desconectado do ${platform === 'meta' ? 'Meta Ads' : 'Google Ads'}.`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Link2 className="w-8 h-8 text-primary" />
                    Integrações
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Conecte suas contas de gerenciador (BM/MCC) para habilitar as automações do Onboarding Mágico.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Meta Ads Card */}
                <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-900/50 transition-colors group">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-[#0668E1] rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                                f
                            </div>
                            {connections.meta.connected && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Conectado
                                </div>
                            )}
                        </div>
                        <CardTitle className="text-xl text-blue-100">Meta Business Manager</CardTitle>
                        <CardDescription className="text-blue-200/60">
                            Habilita criação de Business Managers, Assets e compartilhamento de Pixels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {connections.meta.connected ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                            A
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-100">{connections.meta.accountName}</p>
                                            <p className="text-xs text-blue-300/60">ID: 882371923812</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="hover:bg-red-500/10 hover:text-red-400 text-zinc-500" onClick={() => handleDisconnect('meta')}>
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-500 flex items-center gap-2">
                                    <RefreshCw className="w-3 h-3" />
                                    Token renovado automaticamente há 2 horas.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/10 flex gap-3 text-yellow-500/80 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>Conecte para permitir que o sistema envie convites automaticamente no Onboarding.</p>
                                </div>
                                <Button
                                    className="w-full bg-[#0668E1] hover:bg-[#0556bd] text-white"
                                    onClick={() => handleConnect('meta')}
                                    disabled={connections.meta.loading}
                                >
                                    {connections.meta.loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Conectando...
                                        </>
                                    ) : (
                                        'Conectar Business Manager'
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Google Ads Card */}
                <Card className="bg-zinc-950/50 border-zinc-800 hover:border-red-900/50 transition-colors group">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">
                                <span className="text-[#4285F4]">G</span>
                            </div>
                            {connections.google.connected && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Conectado
                                </div>
                            )}
                        </div>
                        <CardTitle className="text-xl text-red-100">Google Ads MCC</CardTitle>
                        <CardDescription className="text-red-200/60">
                            Habilita vinculação de contas de clientes à sua MCC via convite automático.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {connections.google.connected ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-500 font-bold text-xs ring-2 ring-red-500/20">
                                            U
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-red-100">{connections.google.accountName}</p>
                                            <p className="text-xs text-red-300/60">ID: 123-456-7890</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="hover:bg-red-500/10 hover:text-red-400 text-zinc-500" onClick={() => handleDisconnect('google')}>
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-500 flex items-center gap-2">
                                    <RefreshCw className="w-3 h-3" />
                                    Sincronização ativa. Próxima: em 15 min.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
                                    <p>Necessário acesso de administrador à conta MCC.</p>
                                </div>
                                <Button
                                    className="w-full bg-white text-black hover:bg-zinc-200"
                                    onClick={() => handleConnect('google')}
                                    disabled={connections.google.loading}
                                >
                                    {connections.google.loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Conectando...
                                        </>
                                    ) : (
                                        'Conectar Conta MCC'
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
                <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                    <h3 className="font-semibold text-white mb-2">Permissões Solicitadas</h3>
                    <ul className="text-sm text-zinc-500 space-y-2 list-disc pl-4">
                        <li>ads_management</li>
                        <li>business_management</li>
                        <li>ads_read</li>
                    </ul>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                    <h3 className="font-semibold text-white mb-2">Segurança</h3>
                    <p className="text-sm text-zinc-500">
                        Os tokens de acesso são criptografados no banco e nunca expostos ao frontend.
                    </p>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                    <h3 className="font-semibold text-white mb-2">Webhook</h3>
                    <p className="text-sm text-zinc-500">
                        URL de callback configurada para atualizações em tempo real de status de convites.
                    </p>
                </div>
            </div>
        </div>
    );
}
