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
    Activity
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
                </div>
            </div>

            {/* Dashboard Builder Content */}
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
        </div>
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
