import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    ShieldCheck,
    Zap,
    AlertTriangle,
    Plus,
    Play,
    Pause,
    History,
    TrendingUp,
    TrendingDown,
    Activity,
    Settings,
    Globe,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    PauseCircle,
    PlayCircle,
    ArrowUpRight,
    Users,
    MessageSquare,
    Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// --- MOCK DATA (RULES) ---
interface AutomationRule {
    id: string;
    name: string;
    description: string;
    type: 'stop_loss' | 'scale' | 'alert';
    condition: string;
    action: string;
    isActive: boolean;
    lastTriggered?: string;
    platform: 'Meta' | 'Google' | 'TikTok';
}

const MOCK_RULES: AutomationRule[] = [
    {
        id: '1',
        name: 'Stop Loss - CPA Alto',
        description: 'Pausa anúncios que estão gastando muito sem resultado.',
        type: 'stop_loss',
        condition: 'CPA > R$ 50,00 E Gastos > R$ 100,00',
        action: 'Pausar Anúncio',
        isActive: true,
        lastTriggered: '2 horas atrás',
        platform: 'Meta'
    },
    {
        id: '2',
        name: 'Escala de Vencedores',
        description: 'Aumenta o orçamento de quem está vendendo barato.',
        type: 'scale',
        condition: 'ROAS > 4.0 E CPA < R$ 20,00',
        action: 'Aumentar Budget em 20%',
        isActive: true,
        lastTriggered: 'Ontem',
        platform: 'Meta'
    },
    {
        id: '3',
        name: 'Alerta de Criativo Fadiga',
        description: 'Avisa quando a frequência sobe muito.',
        type: 'alert',
        condition: 'Frequência > 3.0 E CTR < 0.5%',
        action: 'Enviar Notificação WhatsApp',
        isActive: false,
        platform: 'TikTok'
    },
    {
        id: '4',
        name: 'Proteção de Google Search',
        description: 'Impede cliques caros em palavras erradas.',
        type: 'stop_loss',
        condition: 'CPC > R$ 15,00',
        action: 'Pausar Palavra-Chave',
        isActive: true,
        lastTriggered: '15 min atrás',
        platform: 'Google'
    }
];

// --- MOCK DATA (LP SENTINEL) ---
interface MonitoredUrl {
    id: string;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'warning' | 'paused';
    lastCheck: string;
    uptime: number;
    loadTime: number;
    client: string;
}

const MOCK_URLS: MonitoredUrl[] = [
    {
        id: '1',
        name: 'LP VSL Principal',
        url: 'https://seusite.com/vsl-oferta',
        status: 'online',
        lastCheck: 'Agora mesmo',
        uptime: 99.9,
        loadTime: 850,
        client: 'Padaria Artesanal'
    },
    {
        id: '2',
        name: 'Página de Captura Ebook',
        url: 'https://seusite.com/ebook-gratis',
        status: 'online',
        lastCheck: '5 min atrás',
        uptime: 98.5,
        loadTime: 1200,
        client: 'Tech Solutions'
    },
    {
        id: '3',
        name: 'Checkout Oferta Black',
        url: 'https://pay.hotmart.com/xyz',
        status: 'warning',
        lastCheck: '2 min atrás',
        uptime: 95.0,
        loadTime: 4500, // Slow
        client: 'Clínica Dr. João'
    },
    {
        id: '4',
        name: 'Site Institucional',
        url: 'https://construtoraelite.com',
        status: 'offline',
        lastCheck: '1 min atrás',
        uptime: 88.2,
        loadTime: 0,
        client: 'Construtora Elite'
    }
];

export default function TrafficGuard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="GUARDIÃO DE"
                titleAccent="TRÁFEGO"
                subtitle="Central de segurança: Regras, LPs e Grupos."
                badge="TRÁFEGO"
            />

            <Tabs defaultValue="rules" className="space-y-8">
                <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-zinc-900/50 border border-white/5">
                    <TabsTrigger value="rules">Regras & Automação</TabsTrigger>
                    <TabsTrigger value="lp">LP Sentinel (Links)</TabsTrigger>
                    <TabsTrigger value="groups">Group Sentinel</TabsTrigger>
                </TabsList>

                <TabsContent value="rules">
                    <RulesSection />
                </TabsContent>

                <TabsContent value="lp">
                    <LPSentinelSection />
                </TabsContent>

                <TabsContent value="groups">
                    <GroupSentinelSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- SECTIONS ---

function RulesSection() {
    const [rules, setRules] = useState(MOCK_RULES);

    const toggleRule = (id: string, current: boolean) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !current } : r));
        toast.success(current ? "Regra desativada." : "Regra ativada e monitorando.");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Stats/Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Ativas</p>
                                <p className="text-2xl font-bold text-emerald-500">{rules.filter(r => r.isActive).length}</p>
                            </div>
                            <Activity className="w-8 h-8 text-emerald-500/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">Stop Loss</p>
                                <p className="text-2xl font-bold text-red-500">12</p>
                            </div>
                            <ShieldCheck className="w-8 h-8 text-red-500/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Escalados</p>
                                <p className="text-2xl font-bold text-blue-500">5</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500/50" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {rules.map(rule => (
                        <RuleCard key={rule.id} rule={rule} onToggle={() => toggleRule(rule.id, rule.isActive)} />
                    ))}
                </div>
            </div>

            <div className="lg:col-span-1">
                <Card className="h-full border-border/50 bg-muted/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                            <History className="w-4 h-4" /> Log de Atividades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <ScrollArea className="h-[500px] px-6">
                            <div className="space-y-6 relative border-l border-border/50 ml-2 pl-4 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-warning-500 bg-amber-500" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>10:42</span>
                                            <span className="font-mono opacity-50">#1</span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Proteção de Google Search</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Palavra-chave "grátis" pausada (CPC R$ 16,50)</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function LPSentinelSection() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-zinc-950 border-input">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">URLs Monitoradas</CardTitle>
                        <Globe className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">12</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-input">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Uptime Médio</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">99.9%</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-input">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">1</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-input">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Load Time</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">1.2s</div></CardContent>
                </Card>
            </div>

            <div className="rounded-md border border-border/50 bg-card">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Performance</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_URLS.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'online' ? 'outline' : item.status === 'warning' ? 'secondary' : 'destructive'}
                                        className={item.status === 'online' ? 'text-emerald-500 border-emerald-500/20' : ''}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">{item.url}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.loadTime < 1000 ? 'bg-emerald-500' : 'bg-amber-500'} w-[${Math.min(item.loadTime / 20, 100)}%]`} />
                                        </div>
                                        <span className="text-xs">{item.loadTime}ms</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function GroupSentinelSection() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-indigo-500/10 border-indigo-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Grupos Monitorados</p>
                            <p className="text-2xl font-bold text-indigo-400">25</p>
                        </div>
                        <Users className="w-8 h-8 text-indigo-500/50" />
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Links Ativos</p>
                            <p className="text-2xl font-bold text-emerald-400">24</p>
                        </div>
                        <LinkIcon className="w-8 h-8 text-emerald-500/50" />
                    </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">Links Revogados</p>
                            <p className="text-2xl font-bold text-red-500">1</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500/50" />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="relative w-64">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Buscar grupo..." className="pl-8 bg-zinc-950" />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" /> Novo Grupo
                    </Button>
                </div>

                <div className="border border-border/50 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Nome do Grupo</TableHead>
                                <TableHead>Participantes</TableHead>
                                <TableHead>Status Link</TableHead>
                                <TableHead>Atividade (Hoje)</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium text-white">VIP Black Friday #01</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Users className="w-3 h-3" /> 256/1024
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-emerald-500 border-emerald-500/20">Ativo</Badge></TableCell>
                                <TableCell><span className="text-emerald-500 text-xs">+12 msg</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Gerenciar</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-white">VIP Black Friday #02</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Users className="w-3 h-3" /> 1020/1024
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-red-500 border-red-500/20">Revogado (Cheio)</Badge></TableCell>
                                <TableCell><span className="text-zinc-500 text-xs">0 msg</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Gerenciar</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-white">Espera Lançamento Jan</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Users className="w-3 h-3" /> 42/1024
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-emerald-500 border-emerald-500/20">Ativo</Badge></TableCell>
                                <TableCell><span className="text-emerald-500 text-xs">+4 msg</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Gerenciar</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

function RuleCard({ rule, onToggle }: { rule: AutomationRule, onToggle: () => void }) {
    return (
        <Card className={`transition-all duration-300 border-l-4 ${!rule.isActive ? 'border-l-muted opacity-70 grayscale' :
            rule.type === 'stop_loss' ? 'border-l-red-500' :
                rule.type === 'scale' ? 'border-l-emerald-500' : 'border-l-blue-500'
            }`}>
            <CardContent className="p-5 flex items-start gap-4">

                {/* Icon Box */}
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${rule.type === 'stop_loss' ? 'bg-red-500/10 text-red-500' :
                    rule.type === 'scale' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                    {rule.type === 'stop_loss' ? <TrendingDown className="w-5 h-5" /> :
                        rule.type === 'scale' ? <TrendingUp className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-foreground">{rule.name}</h4>
                        <Switch checked={rule.isActive} onCheckedChange={onToggle} />
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>

                    {/* Logic Box */}
                    <div className="mt-3 bg-muted/30 rounded-md p-2 text-xs font-mono flex items-center gap-2 border border-border/50">
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase font-normal">{rule.platform}</Badge>
                        <span className="text-muted-foreground">SE</span>
                        <span className="font-semibold text-foreground">{rule.condition}</span>
                        <span className="text-muted-foreground">ENTÃO</span>
                        <span className="font-semibold text-foreground">{rule.action}</span>
                    </div>

                    {rule.lastTriggered && rule.isActive && (
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Último disparo: {rule.lastTriggered}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
