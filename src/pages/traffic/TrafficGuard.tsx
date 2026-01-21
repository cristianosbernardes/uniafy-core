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
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- MOCK DATA ---
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

interface ActivityLog {
    id: string;
    time: string;
    ruleName: string;
    detail: string;
    type: 'success' | 'warning' | 'info';
}

const MOCK_LOGS: ActivityLog[] = [
    { id: '1', time: '10:42', ruleName: 'Proteção de Google Search', detail: 'Palavra-chave "grátis" pausada (CPC R$ 16,50)', type: 'warning' },
    { id: '2', time: '08:15', ruleName: 'Escala de Vencedores', detail: 'Orçamento aumentado em AdSet "LAL 1%" (R$ 50 -> R$ 60)', type: 'success' },
    { id: '3', time: 'Ontem', ruleName: 'Stop Loss - CPA Alto', detail: 'Anúncio "Vid_03_Depoimento" pausado (CPA R$ 55,00)', type: 'warning' }
];

export default function TrafficGuard() {
    const [rules, setRules] = useState(MOCK_RULES);

    const toggleRule = (id: string, current: boolean) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !current } : r));
        toast.success(current ? "Regra desativada." : "Regra ativada e monitorando.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="GUARDIÃO DE"
                titleAccent="TRÁFEGO"
                subtitle="Automação inteligente e regras de segurança 24/7"
                badge="TRÁFEGO"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT COLUMN: RULES LIST --- */}
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

                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" /> Regras Configuradas
                        </h3>
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" /> Nova Regra
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {rules.map(rule => (
                            <RuleCard key={rule.id} rule={rule} onToggle={() => toggleRule(rule.id, rule.isActive)} />
                        ))}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ACTIVITY LOG --- */}
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
                                    {MOCK_LOGS.map((log, i) => (
                                        <div key={log.id} className="relative">
                                            {/* Dot */}
                                            <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background ${log.type === 'success' ? 'bg-emerald-500' :
                                                    log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />

                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                    <span>{log.time}</span>
                                                    <span className="font-mono opacity-50">#{log.id}</span>
                                                </div>
                                                <p className="text-sm font-medium text-foreground">{log.ruleName}</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {log.detail}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Empty space for effect */}
                                    <div className="h-12 border-l border-dashed border-border/30 absolute left-0 bottom-0" />
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
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
