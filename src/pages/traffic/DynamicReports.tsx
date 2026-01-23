import { useTraffic } from "@/contexts/TrafficContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Share2,
    Layout,
    BarChart3,
    TrendingUp,
    DollarSign,
    Users,
    Eye,
    MousePointer2,
    Plus,
    Copy,
    Check,
    Activity,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DynamicReports() {
    const { selectedClient } = useTraffic();
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mock link generation
    const mockToken = `dash_${selectedClient?.id || 'demo'}_${Date.now().toString(36)}`;
    const shareLink = `${window.location.origin}/shared/${mockToken}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copiado para a área de transferência!");
    };

    if (!selectedClient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                    <Layout className="w-8 h-8 text-zinc-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Nenhum Cliente Selecionado</h2>
                <p className="text-zinc-500 max-w-md text-center">
                    Selecione um cliente no topo da página para visualizar e editar seus relatórios.
                </p>
            </div>
        );
    }

    // State for automation dialog
    const [automationOpen, setAutomationOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <PageHeader
                        title="RELATÓRIOS"
                        titleAccent="DINÂMICOS"
                        subtitle={`Editando dashboard de: ${selectedClient.company_name}`}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white" onClick={() => setAutomationOpen(true)}>
                        <Activity className="w-4 h-4 mr-2" />
                        Automação
                    </Button>

                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Últimos 30 dias
                    </Button>

                    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartilhar Relatório
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-white/10">
                            <DialogHeader>
                                <DialogTitle>Compartilhar Dashboard</DialogTitle>
                                <DialogDescription>
                                    Envie este link para seu cliente. Ele terá acesso de visualização aos dados em tempo real, sem precisar de login.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-4">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input
                                        id="link"
                                        defaultValue={shareLink}
                                        readOnly
                                        className="bg-black/40 border-white/10 text-zinc-300 h-10"
                                    />
                                </div>
                                <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    <span className="sr-only">Copiar</span>
                                </Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <div className="text-[10px] text-zinc-500 mt-2">
                                    * Este link é público mas seguro (tokenizado). Qualquer pessoa com o link poderá ver os dados.
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <ReportAutomationConfig open={automationOpen} onOpenChange={setAutomationOpen} clientName={selectedClient.company_name} />
                </div>
            </div>

            {/* TABS NAVIGATION */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-black/40 border border-white/5 p-1 h-auto">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 text-xs uppercase tracking-wider">Visão Geral</TabsTrigger>
                    <TabsTrigger value="meta" className="data-[state=active]:bg-[#1877F2]/20 data-[state=active]:text-[#1877F2] text-xs uppercase tracking-wider">Meta Ads</TabsTrigger>
                    <TabsTrigger value="google" className="data-[state=active]:bg-[#4285F4]/20 data-[state=active]:text-[#4285F4] text-xs uppercase tracking-wider">Google Ads</TabsTrigger>
                    <TabsTrigger value="instagram" className="data-[state=active]:bg-[#E1306C]/20 data-[state=active]:text-[#E1306C] text-xs uppercase tracking-wider">Instagram Analytics</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB (Current Builder) */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Main Preview Area */}
                        <div className="col-span-12 lg:col-span-9 space-y-6">
                            {/* KPI Widget Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MockKpiCard title="Investimento" value="R$ 14.230" trend="+12%" icon={DollarSign} color="text-emerald-500" />
                                <MockKpiCard title="Impressões" value="450.2k" trend="+5%" icon={Eye} color="text-blue-500" />
                                <MockKpiCard title="Cliques" value="12.4k" trend="-2%" icon={MousePointer2} color="text-amber-500" />
                                <MockKpiCard title="Leads" value="3,402" trend="+18%" icon={Users} color="text-purple-500" />
                            </div>

                            {/* Chart Widget */}
                            <Card className="bg-black/20 border-white/5 border-dashed relative group min-h-[400px]">
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" size="sm">Editar Gráfico</Button>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-zinc-400 font-light">Performance Semestral</CardTitle>
                                    <CardDescription>Mock Preview</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center h-[300px]">
                                    <BarChart3 className="w-16 h-16 text-zinc-700" />
                                    <span className="ml-4 text-zinc-600">Gráfico de visualização (Reportei Style)</span>
                                </CardContent>
                            </Card>

                            {/* Add New Section Button */}
                            <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-700 hover:bg-white/5 transition-all group">
                                <div className="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-zinc-400">
                                    <Plus className="w-8 h-8" />
                                    <span className="text-sm font-medium">Adicionar Nova Seção / Métrica</span>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Controls */}
                        <div className="col-span-12 lg:col-span-3 space-y-4">
                            <Card className="bg-zinc-900/50 border-white/10 sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-wider text-zinc-500">Elementos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <DraggableItem label="Métrica Simples" icon={TrendingUp} />
                                    <DraggableItem label="Gráfico de Linha" icon={Activity} />
                                    <DraggableItem label="Gráfico de Barras" icon={BarChart3} />
                                    <DraggableItem label="Tabela de Dados" icon={Layout} />
                                    <DraggableItem label="Texto Livre" icon={Layout} />
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900/50 border-white/10 sticky top-80">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-wider text-zinc-500">Configurações</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400">Título do Relatório</Label>
                                        <Input className="bg-black/20 border-zinc-800 h-8 text-sm" defaultValue="Relatório Mensal" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400">Logotipo</Label>
                                        <div className="h-20 bg-black/20 border border-zinc-800 rounded flex items-center justify-center text-xs text-zinc-600">
                                            Logo do Cliente
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* META ADS TAB */}
                <TabsContent value="meta" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ReportActionCard title="Relatório Diário" desc="Resumo rápido de performance das últimas 24h" icon={Activity} onClick={() => setAutomationOpen(true)} />
                        <ReportActionCard title="Relatório Semanal" desc="Análise de tendências e otimizações da semana" icon={Calendar} onClick={() => setAutomationOpen(true)} />
                        <ReportActionCard title="Relatório Mensal" desc="Visão consolidada de fechamento e ROI" icon={BarChart3} onClick={() => setAutomationOpen(true)} />
                    </div>
                    <div className="p-12 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                        <Share2 className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">Relatórios Automatizados Meta Ads</h3>
                        <p className="max-w-md text-center">
                            Selecione um formato acima para gerar instantaneamente. Os dados são puxados via API Graph do Facebook.
                        </p>
                    </div>
                </TabsContent>

                {/* GOOGLE ADS TAB */}
                <TabsContent value="google" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <ReportActionCard title="Relatório Diário" desc="Performance Search/Display ontem" icon={Activity} onClick={() => setAutomationOpen(true)} />
                        <ReportActionCard title="Relatório Semanal" desc="Evolução de CPC e Conversões" icon={Calendar} onClick={() => setAutomationOpen(true)} />
                        <ReportActionCard title="Relatório Mensal" desc="Consolidado geral da conta" icon={BarChart3} onClick={() => setAutomationOpen(true)} />
                        <ReportActionCard title="Termos de Pesquisa" desc="Análise de termos busados (Negativação)" icon={Search} isNew onClick={() => setAutomationOpen(true)} />
                    </div>
                    <div className="p-12 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                        <Share2 className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">Google Ads Intelligence</h3>
                        <p className="max-w-md text-center">
                            Acesse termos de pesquisa e relatórios detalhados diretamente da API do Google Ads.
                        </p>
                    </div>
                </TabsContent>

                {/* INSTAGRAM TAB */}
                <TabsContent value="instagram" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportActionCard title="Métricas & Dados" desc="Engajamento, Alcance e Stories" icon={TrendingUp} />
                        <ReportActionCard title="Seguidores & Concorrentes" desc="Crescimento de base e Benchmarking" icon={Users} />
                    </div>
                    <div className="p-12 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 opacity-80">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Instagram Deep Dive</h3>
                        <p className="max-w-md text-center">
                            Analise o crescimento do perfil e monitore concorrentes em tempo real.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}



// ------------------------------------------------------------------
// AUTOMATION CONFIG COMPONENT
// ------------------------------------------------------------------

function ReportAutomationConfig({ open, onOpenChange, clientName }: { open: boolean, onOpenChange: (open: boolean) => void, clientName: string }) {
    const [platform, setPlatform] = useState<"meta" | "google">("meta");
    const [loading, setLoading] = useState<string | null>(null);

    // Initial state from localStorage or defaults
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem(`report_config_${clientName}`);
        return saved ? JSON.parse(saved) : {
            meta: {
                accountId: "",
                chatId: "",
                sheetId: "",
                tabId: "",
                dailyWebhook: "",
                weeklyWebhook: "",
                monthlyWebhook: ""
            },
            google: {
                managerId: "",
                clientId: "",
                chatId: "",
                sheetId: "",
                tabId: "",
                dailyWebhook: "",
                weeklyWebhook: "",
                monthlyWebhook: "",
                accessToken: "",
                devToken: ""
            }
        };
    });

    const handleSave = () => {
        localStorage.setItem(`report_config_${clientName}`, JSON.stringify(config));
        toast.success("Configurações salvas!");
    };

    const updateConfig = (key: string, value: string) => {
        setConfig((prev: any) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [key]: value
            }
        }));
    };

    const triggerReport = async (type: "daily" | "weekly" | "monthly") => {
        const currentConfig = config[platform];
        const webhookUrl = currentConfig[`${type}Webhook`];

        if (!webhookUrl) {
            toast.error(`Configure o Webhook de relatório ${type} primeiro.`);
            return;
        }

        setLoading(type);
        try {
            // Build payload based on platform
            const payload: any = {
                clientName: clientName,
                chatId: currentConfig.chatId,
                planilhaRelatorio: currentConfig.sheetId, // Mapping to n8n expected fields
                planilhaRelatorioMensal: currentConfig.sheetId, // Fallback for monthly
                idAba: currentConfig.tabId,
                IDaba: currentConfig.tabId, // Fallback for weekly/monthly casing
                ABAplanilhaRelatorio: currentConfig.sheetTabName || "Página1", // Google Ads expects sheet name sometimes?
                ABAplanilhaRelatorioMensal: currentConfig.sheetTabName || "Página1"
            };

            if (platform === "meta") {
                payload.accountId = currentConfig.accountId;
            } else {
                payload.managerCustomerID = currentConfig.managerId;
                payload.clientCustomerID = currentConfig.clientId;
                payload["acess-token"] = currentConfig.accessToken;
                payload["developer-token"] = currentConfig.devToken;
            }

            // Send request
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success(`Relatório ${type} disparado com sucesso!`);
            } else {
                toast.error("Erro ao disparar relatório. Verifique o console.");
                console.error("Webhook Error", await response.text());
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão com o Webhook.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Automação de Relatórios</DialogTitle>
                    <DialogDescription>
                        Configure os parâmetros para disparo manual via n8n. Dados salvos localmente.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={platform} onValueChange={(v: any) => setPlatform(v)} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="meta">Meta Ads</TabsTrigger>
                        <TabsTrigger value="google">Google Ads</TabsTrigger>
                    </TabsList>

                    {/* META FORM */}
                    <TabsContent value="meta" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome do Cliente</Label>
                                <Input value={clientName} disabled className="bg-zinc-900/50 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ad Account ID (act_...)</Label>
                                <Input
                                    placeholder="act_123456789"
                                    value={config.meta.accountId}
                                    onChange={(e) => updateConfig("accountId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Chat ID (Telegram)</Label>
                                <Input
                                    placeholder="-100..."
                                    value={config.meta.chatId}
                                    onChange={(e) => updateConfig("chatId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Planilha ID</Label>
                                <Input
                                    placeholder="1abc..."
                                    value={config.meta.sheetId}
                                    onChange={(e) => updateConfig("sheetId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ID da Aba (Sheet GID)</Label>
                                <Input
                                    placeholder="0"
                                    value={config.meta.tabId}
                                    onChange={(e) => updateConfig("tabId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="border-t border-zinc-800 pt-4 mt-4">
                            <Label className="text-zinc-400 mb-2 block">Webhooks n8n</Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.meta.dailyWebhook}
                                        onChange={(e) => updateConfig("dailyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("daily")}
                                        disabled={!!loading}
                                        className="w-32 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 border border-emerald-600/20"
                                    >
                                        {loading === "daily" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Diário"}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.meta.weeklyWebhook}
                                        onChange={(e) => updateConfig("weeklyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("weekly")}
                                        disabled={!!loading}
                                        className="w-32 bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 border border-blue-600/20"
                                    >
                                        {loading === "weekly" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Semanal"}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.meta.monthlyWebhook}
                                        onChange={(e) => updateConfig("monthlyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("monthly")}
                                        disabled={!!loading}
                                        className="w-32 bg-purple-600/20 text-purple-500 hover:bg-purple-600/30 border border-purple-600/20"
                                    >
                                        {loading === "monthly" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Mensal"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* GOOGLE FORM */}
                    <TabsContent value="google" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome do Cliente</Label>
                                <Input value={clientName} disabled className="bg-zinc-900/50 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Chat ID (Telegram)</Label>
                                <Input
                                    placeholder="-100..."
                                    value={config.google.chatId}
                                    onChange={(e) => updateConfig("chatId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Manager ID (MCC)</Label>
                                <Input
                                    placeholder="1234567890"
                                    value={config.google.managerId}
                                    onChange={(e) => updateConfig("managerId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Client Customer ID (SEM HÍFEN)</Label>
                                <Input
                                    placeholder="1234567890"
                                    value={config.google.clientId}
                                    onChange={(e) => {
                                        // Remove dashes automatically
                                        const clean = e.target.value.replace(/-/g, '');
                                        updateConfig("clientId", clean);
                                    }}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Access Token</Label>
                                <Input
                                    type="password"
                                    placeholder="ya29..."
                                    value={config.google.accessToken}
                                    onChange={(e) => updateConfig("accessToken", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Developer Token</Label>
                                <Input
                                    type="password"
                                    placeholder="AbC..."
                                    value={config.google.devToken}
                                    onChange={(e) => updateConfig("devToken", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Planilha ID</Label>
                                <Input
                                    placeholder="1abc..."
                                    value={config.google.sheetId}
                                    onChange={(e) => updateConfig("sheetId", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome da Aba (Ex: Página1)</Label>
                                <Input
                                    placeholder="Página1"
                                    value={config.google.sheetTabName}
                                    onChange={(e) => updateConfig("sheetTabName", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="border-t border-zinc-800 pt-4 mt-4">
                            <Label className="text-zinc-400 mb-2 block">Webhooks n8n</Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.google.dailyWebhook}
                                        onChange={(e) => updateConfig("dailyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("daily")}
                                        disabled={!!loading}
                                        className="w-32 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 border border-emerald-600/20"
                                    >
                                        {loading === "daily" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Diário"}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.google.weeklyWebhook}
                                        onChange={(e) => updateConfig("weeklyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("weekly")}
                                        disabled={!!loading}
                                        className="w-32 bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 border border-blue-600/20"
                                    >
                                        {loading === "weekly" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Semanal"}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://n8n.seu-dominio.com/webhook/..."
                                        value={config.google.monthlyWebhook}
                                        onChange={(e) => updateConfig("monthlyWebhook", e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                                    />
                                    <Button
                                        onClick={() => triggerReport("monthly")}
                                        disabled={!!loading}
                                        className="w-32 bg-purple-600/20 text-purple-500 hover:bg-purple-600/30 border border-purple-600/20"
                                    >
                                        {loading === "monthly" ? <Activity className="w-4 h-4 animate-spin" /> : "Gerar Mensal"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
                    <Button onClick={handleSave} className="bg-white text-black hover:bg-zinc-200">Salvar Configurações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ReportActionCard({ title, desc, icon: Icon, isNew }: any) {
    return (
        <Card className="bg-zinc-900/50 border-white/5 hover:border-primary/50 hover:bg-zinc-900 transition-all cursor-pointer group relative overflow-hidden">
            {isNew && (
                <div className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                    NOVO
                </div>
            )}
            <CardContent className="p-6">
                <Icon className="w-8 h-8 text-zinc-600 group-hover:text-primary mb-4 transition-colors" />
                <h3 className="font-bold text-zinc-200 group-hover:text-white mb-1 transition-colors">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </CardContent>
        </Card>
    );
}

function MockKpiCard({ title, value, trend, icon: Icon, color }: any) {
    return (
        <Card className="bg-black/40 border-white/5 hover:border-white/20 transition-all cursor-move group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-zinc-900/50 ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100">
                        <Layout className="w-4 h-4 text-zinc-600" />
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{title}</span>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold text-white leading-none">{value}</h3>
                        <span className="text-xs text-emerald-500 font-medium mb-0.5">{trend}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DraggableItem({ label, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-md bg-black/20 border border-transparent hover:border-zinc-700 hover:bg-black/40 cursor-grab active:cursor-grabbing transition-colors group">
            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200">{label}</span>
        </div>
    )
}
