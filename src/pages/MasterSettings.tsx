import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Bell, ShieldAlert, MessageSquare, Mail, Zap, Save } from 'lucide-react';
import { masterService } from '@/services/masterService';
import { MasterNotificationConfig } from '@/types/uniafy';

export default function MasterSettings() {
    const [config, setConfig] = useState<MasterNotificationConfig>({
        is_active: false,
        trigger_days_before: 5,
        channels: { popup: true, email: true, whatsapp: false },
        message_title: "Atenção Financeira",
        message_body: "Sua fatura vence em {dias_restantes} dias."
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await masterService.getGlobalConfig();
            if (data) setConfig(data);
        } catch (error) {
            console.error('Erro ao carregar config:', error);
            toast.error('Falha ao carregar configurações.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setIsLoading(true);

        try {
            await masterService.updateGlobalConfig(config);
            toast.success('Configurações globais atualizadas com sucesso!');
        } catch (error) {
            console.error("Error saving config:", error); // DEBUG
            toast.error('Erro ao salvar no banco de dados.');
        } finally {
            setIsLoading(false);
        }
    };

    // if (!config) return <div className="p-8">Carregando configurações...</div>; // Legacy blocking load removed

    return (
        <div className="space-y-8">
            <PageHeader
                title="CENTRAL DE"
                titleAccent="ALERTAS"
                subtitle="Master Suite • Automação de notificações e réguas de cobrança"
            />
            {isFetching && <div className="text-xs text-muted-foreground animate-pulse absolute top-4 right-8">Sincronizando...</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Trigger Rules */}
                <div className="space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase text-white">Gatilho de Automação</h3>
                                <p className="text-[10px] text-muted-foreground uppercase">Quando o sistema deve agir?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Dias antes do Vencimento</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        className="bg-black/40 border-white/10 font-mono text-lg h-12 w-24 text-center"
                                        value={config.trigger_days_before}
                                        onChange={(e) => setConfig({ ...config, trigger_days_before: Number(e.target.value) })}
                                    />
                                    <span className="text-sm text-muted-foreground font-medium">dias antes</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground opacity-60">
                                    O alerta será disparado automaticamente quando faltarem {config.trigger_days_before} dias para o vencimento da fatura da Agência.
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase text-white">Status da Automação</span>
                                    <p className="text-[10px] text-muted-foreground">Ligar/Desligar todo o sistema de cobrança</p>
                                </div>
                                <Switch
                                    checked={config.is_active}
                                    onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase text-white">Canais de Disparo</h3>
                                <p className="text-[10px] text-muted-foreground uppercase">Onde o cliente receberá o aviso?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-bold uppercase text-zinc-300">Pop-up no Sistema (Top Bar)</span>
                                </div>
                                <Switch
                                    checked={config.channels.popup}
                                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, popup: c } }))}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold uppercase text-zinc-300">Email Automático</span>
                                </div>
                                <Switch
                                    checked={config.channels.email}
                                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, channels: { ...prev.channels, email: c } }))}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-bold uppercase text-zinc-300">WhatsApp (Em breve)</span>
                                </div>
                                <Switch disabled checked={false} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Message Template */}
                <div className="glass-card p-6 space-y-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-white">Template da Mensagem</h3>
                            <p className="text-[10px] text-muted-foreground uppercase">Personalize o texto do alerta</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Título do Alerta</Label>
                            <Input
                                className="bg-black/40 border-white/10"
                                value={config.message_title}
                                onChange={(e) => setConfig({ ...config, message_title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Corpo da Mensagem</Label>
                            <Textarea
                                className="bg-black/40 border-white/10 min-h-[150px] font-sans resize-none"
                                value={config.message_body}
                                onChange={(e) => setConfig({ ...config, message_body: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Variáveis disponíveis: <span className="text-primary">{`{dias_restantes}`}</span>, <span className="text-primary">{`{valor_fatura}`}</span>
                            </p>
                        </div>

                        <div className="mt-8 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                            <h4 className="text-[10px] font-black uppercase text-blue-400 mb-2">Preview (Como o cliente vê):</h4>
                            <div className="bg-blue-600 text-white p-3 rounded text-xs font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                {config.message_title}: {config.message_body}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase gap-2"
                    >
                        {isLoading ? 'Salvando...' : (
                            <>
                                <Save className="w-4 h-4" /> Salvar Configuração Master
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
