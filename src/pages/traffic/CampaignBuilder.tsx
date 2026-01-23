import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Zap,
    ArrowRight,
    ArrowLeft,
    Check,
    Layers,
    Target,
    Image as ImageIcon,
    Code,
    Copy,
    Rocket,
    Megaphone,
    MousePointerClick,
    MessageCircle,
    Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// --- MOCK CREATIVES FROM HUB ---
const MOCK_CREATIVES = [
    { id: '1', title: 'Story VSL Oferta Black.mp4', type: 'video', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
    { id: '2', title: 'Feed Carrossel Capa.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?w=800&q=80' },
    { id: '3', title: 'Reels Depoimento.mp4', type: 'video', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
];

export default function CampaignBuilder() {
    const [step, setStep] = useState(1);

    // FORM STATE
    const [campaign, setCampaign] = useState({
        name: '',
        objective: 'OUTCOME_SALES',
        cbo: false,
        specialAd: false,
    });

    const [adSet, setAdSet] = useState({
        name: 'AdSet 01 - Aberto',
        budgetType: 'DAILY',
        budgetAmount: 50,
        startDate: new Date().toISOString().slice(0, 16),
        audience: 'BROAD',
        placement: 'ADVANTAGE_PLUS',
    });

    const [ad, setAd] = useState({
        name: 'Ad 01 - Criativo Vencedor',
        creativeId: '',
        primaryText: '',
        headline: '',
        description: '',
        destination: '',
    });

    // --- NAMING GENERATOR HELPER ---
    // Simple version of NamingGovernor logic
    const generateName = () => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        let objShort = 'GEN';
        if (campaign.objective === 'OUTCOME_SALES') objShort = 'CONV';
        if (campaign.objective === 'OUTCOME_LEADS') objShort = 'LEAD';
        if (campaign.objective === 'OUTCOME_AWARENESS') objShort = 'RECON';
        if (campaign.objective === 'OUTCOME_TRAFFIC') objShort = 'TRAF';
        if (campaign.objective === 'OUTCOME_ENGAGEMENT') objShort = 'ENGA';
        if (campaign.objective === 'OUTCOME_APP_PROMOTION') objShort = 'APP';

        const type = campaign.cbo ? 'CBO' : 'ABO';
        const newName = `${date}_META_${objShort}_${type}_PRODUTO`;
        setCampaign({ ...campaign, name: newName });
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSend = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Enviando payload para n8n...',
            success: 'Campanha enviada para processamento! Verifique o log no n8n.',
            error: 'Erro de conexão com o webhook.'
        });
    };

    const payload = {
        source: 'uniafy_builder',
        timestamp: new Date().toISOString(),
        campaign,
        adSet,
        ad
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <PageHeader
                title="CRIADOR DE"
                titleAccent="CAMPANHAS"
                subtitle="Wizard integrado para criação rápida em múltiplas plataformas"
                badge="BETA"
            />

            {/* TABS FOR AUTOMATION TYPES */}
            <Tabs defaultValue="create" className="space-y-8">
                <div className="flex justify-center">
                    <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-zinc-900/50 border border-white/5">
                        <TabsTrigger value="create">Criar & Subir</TabsTrigger>
                        <TabsTrigger value="process">Processar</TabsTrigger>
                        <TabsTrigger value="tools">Ferramentas</TabsTrigger>
                    </TabsList>
                </div>

                {/* TAB 1: CREATE (EXISTING WIZARD) */}
                <TabsContent value="create">
                    {/* PROGRESS STEPS */}
                    <nav aria-label="Progress">
                        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                            <StepItem current={step} index={1} label="Campanha" icon={Layers} />
                            <StepItem current={step} index={2} label="Conjunto" icon={Target} />
                            <StepItem current={step} index={3} label="Anúncio" icon={ImageIcon} />
                            <StepItem current={step} index={4} label="Revisão" icon={Code} />
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-3 gap-8 mt-8">
                        {/* --- MAIN FORM AREA --- */}
                        <Card className="lg:col-span-2 border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    {step === 1 && "Configuração da Campanha"}
                                    {step === 2 && "Configuração do Conjunto (AdSet)"}
                                    {step === 3 && "Criativo e Copy"}
                                    {step === 4 && "Revisão e Disparo"}
                                </CardTitle>
                                <CardDescription>
                                    {step === 1 && "Defina o objetivo, estratégia e nomenclatura."}
                                    {step === 2 && "Quem você quer alcançar e quanto quer gastar?"}
                                    {step === 3 && "Selecione os ativos da Central de Criativos."}
                                    {step === 4 && "Valide o JSON que será enviado para o n8n."}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6 min-h-[400px]">

                                {/* STEP 1: CAMPAIGN */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label>Estratégia de Subida (Automação)</Label>
                                            <Select defaultValue="manual">
                                                <SelectTrigger className="h-12 border-primary/20 bg-primary/5">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-primary" />
                                                        <SelectValue />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="manual">Personalizada (Manual)</SelectItem>
                                                    <SelectItem value="engagement">Engajamento no Post (Auto)</SelectItem>
                                                    <SelectItem value="video">Visualização de Vídeo (Auto)</SelectItem>
                                                    <SelectItem value="profile">Tráfego para Perfil (Auto)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[10px] text-muted-foreground">Selecionar uma estratégia automática preenche os campos abaixo com as melhores práticas.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Objetivo</Label>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_AWARENESS'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_AWARENESS' })}
                                                    icon={Megaphone} title="Reconhecimento" desc="Alcance, Brand Awareness"
                                                />
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_TRAFFIC'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_TRAFFIC' })}
                                                    icon={MousePointerClick} title="Tráfego" desc="Cliques no Link, Visitas"
                                                />
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_ENGAGEMENT'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_ENGAGEMENT' })}
                                                    icon={MessageCircle} title="Engajamento" desc="Mensagens, Video Views"
                                                />
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_LEADS'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_LEADS' })}
                                                    icon={Target} title="Leads" desc="Formulários Instantâneos"
                                                />
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_APP_PROMOTION'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_APP_PROMOTION' })}
                                                    icon={Smartphone} title="Promoção do App" desc="Instalações, Eventos no App"
                                                />
                                                <ObjectiveCard
                                                    selected={campaign.objective === 'OUTCOME_SALES'}
                                                    onClick={() => setCampaign({ ...campaign, objective: 'OUTCOME_SALES' })}
                                                    icon={Zap} title="Vendas" desc="Conversões, Vendas de Catálogo"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Nome da Campanha</Label>
                                                <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={generateName}>
                                                    Gerar Nome Padrão
                                                </Button>
                                            </div>
                                            <Input
                                                value={campaign.name}
                                                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                                                placeholder="Ex: 20240521_SALES_CBO_..."
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Advantage+ Budget (CBO)</Label>
                                                <p className="text-sm text-muted-foreground">Otimizar orçamento no nível da campanha</p>
                                            </div>
                                            <Switch
                                                checked={campaign.cbo}
                                                onCheckedChange={(c) => setCampaign({ ...campaign, cbo: c })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: ADSET */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Nome do Conjunto</Label>
                                            <Input
                                                value={adSet.name}
                                                onChange={(e) => setAdSet({ ...adSet, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Tipo de Orçamento</Label>
                                                <Select
                                                    value={adSet.budgetType}
                                                    onValueChange={(v) => setAdSet({ ...adSet, budgetType: v })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="DAILY">Diário</SelectItem>
                                                        <SelectItem value="LIFETIME">Vitalício</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Valor (R$)</Label>
                                                <Input
                                                    type="number"
                                                    value={adSet.budgetAmount}
                                                    onChange={(e) => setAdSet({ ...adSet, budgetAmount: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Público (Audience Vault)</Label>
                                            <Select
                                                value={adSet.audience}
                                                onValueChange={(v) => setAdSet({ ...adSet, audience: v })}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="BROAD">Aberto (Broad)</SelectItem>
                                                    <SelectItem value="LAL_1">Lookalike 1% Compradores</SelectItem>
                                                    <SelectItem value="RETARGETING">Visitantes 30D</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: ADS */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Selecione o Criativo (Creative Hub)</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {MOCK_CREATIVES.map(c => (
                                                    <div
                                                        key={c.id}
                                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${ad.creativeId === c.id ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                        onClick={() => setAd({ ...ad, creativeId: c.id })}
                                                    >
                                                        <img src={c.url} alt={c.title} className="w-full h-24 object-cover" />
                                                        {ad.creativeId === c.id && (
                                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                                <Check className="w-6 h-6 text-white bg-primary rounded-full p-1" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Texto Principal</Label>
                                            <Textarea
                                                placeholder="Digite a copy do anúncio..."
                                                value={ad.primaryText}
                                                onChange={(e) => setAd({ ...ad, primaryText: e.target.value })}
                                                className="min-h-[100px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Título (Headline)</Label>
                                            <Input
                                                placeholder="Ex: Oferta Limitada - 50% OFF"
                                                value={ad.headline}
                                                onChange={(e) => setAd({ ...ad, headline: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>URL de Destino</Label>
                                            <Input
                                                placeholder="https://seu-site.com/oferta"
                                                value={ad.destination}
                                                onChange={(e) => setAd({ ...ad, destination: e.target.value })}
                                            />
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Check className="w-3 h-3 text-emerald-500" /> UTMs serão adicionadas automaticamente pelo Tracking Manager.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: REVIEW */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="bg-zinc-950 p-4 rounded-lg border border-border/50 relative group">
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <pre className="font-mono text-xs text-blue-300 overflow-x-auto p-2">
                                                {JSON.stringify(payload, null, 2)}
                                            </pre>
                                        </div>

                                        <div className="bg-amber-500/10 p-4 rounded-lg flex items-start gap-3">
                                            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-amber-500 text-sm">Pronto para Disparo</h4>
                                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                                    Ao clicar em enviar, este JSON será postado no Webhook do n8n configurado em <strong>Conexões & APIs</strong>.
                                                    Certifique-se que o workflow "Create Campaign" está ativo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </CardContent>

                            <CardFooter className="flex justify-between border-t border-border/50 p-6 bg-muted/5">
                                <Button variant="ghost" onClick={prevStep} disabled={step === 1}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                                </Button>

                                {step < 4 ? (
                                    <Button onClick={nextStep}>
                                        Próximo <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                                        <Rocket className="w-4 h-4 mr-2" /> Disparar Campanha
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>

                        {/* --- RIGHT: SIDEBAR INFO --- */}
                        <div className="space-y-6">
                            <Card className="border-border/50 bg-blue-500/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Resumo da Estrutura</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-4">
                                    <div>
                                        <span className="text-muted-foreground text-xs uppercase block mb-1">Campanha</span>
                                        <p className="font-medium truncate" title={campaign.name || 'Sem nome'}>{campaign.name || 'Nova Campanha'}</p>
                                        <Badge variant="outline" className="mt-1 text-[10px]">{campaign.objective}</Badge>
                                    </div>
                                    <div className="pl-3 border-l-2 border-border/50">
                                        <span className="text-muted-foreground text-xs uppercase block mb-1">AdSet</span>
                                        <p className="font-medium truncate">{adSet.name}</p>
                                        <p className="text-xs text-muted-foreground">R$ {adSet.budgetAmount} / {adSet.budgetType}</p>
                                    </div>
                                    <div className="pl-6 border-l-2 border-border/50">
                                        <span className="text-muted-foreground text-xs uppercase block mb-1">Anúncio</span>
                                        <p className="font-medium truncate">{ad.name}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Status das Integrações</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <IntegrationStatus label="n8n Webhook" status="active" />
                                    <IntegrationStatus label="Meta Ads API" status="active" />
                                    <IntegrationStatus label="Creative Hub" status="active" />
                                    <IntegrationStatus label="OpenAI (Copy)" status="inactive" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: PROCESS */}
                <TabsContent value="process">
                    <Card className="max-w-xl mx-auto border-border/50 mt-12">
                        <CardHeader>
                            <CardTitle>Processar Campanhas</CardTitle>
                            <CardDescription>Automação de análise e aplicação de regras.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
                            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse">
                                <Zap className="w-10 h-10 text-orange-500" />
                            </div>
                            <p className="text-center text-zinc-400">
                                Esta automação irá analisar todas as campanhas ativas, verificar regras de orçamento e pausar conjuntos de baixo desempenho.
                            </p>
                            <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                                Executar Processamento Agora
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: TOOLS */}
                <TabsContent value="tools">
                    <Card className="border-border/50 mt-8">
                        <CardHeader>
                            <CardTitle>Ferramentas de Otimização</CardTitle>
                            <CardDescription>Utilitários para gestão em massa.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 border border-zinc-800 rounded-xl bg-black/20 hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Copy className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">Copiar Colunas</h3>
                                </div>
                                <p className="text-sm text-zinc-500 mb-4">
                                    Transfira configurações de colunas personalizadas entre contas de anúncio diferentes no Meta Ads.
                                </p>
                                <Button variant="outline" className="w-full">Iniciar Cópia</Button>
                            </div>

                            <div className="p-6 border border-zinc-800 rounded-xl bg-black/20 hover:bg-zinc-900/50 transition-colors cursor-pointer group opacity-50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-zinc-800 rounded-lg text-zinc-500">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">Prévia Mobile</h3>
                                </div>
                                <p className="text-sm text-zinc-500 mb-4">
                                    Em breve: visualize anúncios diretamente no formato nativo do celular.
                                </p>
                                <Button variant="outline" className="w-full" disabled>Em Breve</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}


function StepItem({ current, index, label, icon: Icon }: any) {
    const isActive = current === index;
    const isCompleted = current > index;

    return (
        <li className="relative md:flex-1 md:flex">
            <div className={`group flex items-center w-full ${isActive ? 'md:border-b-2 md:border-primary' : isCompleted ? 'md:border-b-2 md:border-emerald-500' : 'md:border-b-2 md:border-muted'}`}>
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${isActive ? 'border-primary bg-primary text-white' :
                        isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                            'border-muted bg-transparent text-muted-foreground'
                        }`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className={`ml-4 text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                </span>
            </div>
        </li>
    );
}

function ObjectiveCard({ selected, onClick, icon: Icon, title, desc }: any) {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${selected ? 'border-primary bg-primary/5' : 'border-border/50'
                }`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${selected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
        </div>
    );
}

function IntegrationStatus({ label, status }: { label: string, status: 'active' | 'inactive' }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <span className={status === 'active' ? 'text-emerald-500' : 'text-zinc-500'}>
                    {status === 'active' ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>
    );
}
