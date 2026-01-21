import React from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Gauge,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    DollarSign,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// --- MOCK DATA ---
interface PacingAccount {
    id: string;
    clientName: string;
    platform: 'Meta' | 'Google' | 'TikTok';
    budgetTotal: number;
    spendCurrent: number;
    daysPassed: number;
    daysTotal: number; // usually days in month
    status: 'on_track' | 'overspending' | 'underspending';
    recommendation: string;
}

const MOCK_PACING: PacingAccount[] = [
    {
        id: '1',
        clientName: 'Padaria Artesanal - Meta Ads',
        platform: 'Meta',
        budgetTotal: 5000,
        spendCurrent: 3500,
        daysPassed: 21,
        daysTotal: 30,
        status: 'on_track',
        recommendation: 'Ritmo perfeito. Mantenha o orçamento diário atual.'
    },
    {
        id: '2',
        clientName: 'Tech Solutions - Google Search',
        platform: 'Google',
        budgetTotal: 10000,
        spendCurrent: 9000,
        daysPassed: 21, // 70% days passed
        daysTotal: 30,  // 90% budget spent!
        status: 'overspending',
        recommendation: 'Ritmo acelerado! Reduza o budget diário em 35% para não zerar antes do dia 30.'
    },
    {
        id: '3',
        clientName: 'Clínica Dr. João - Meta Ads',
        platform: 'Meta',
        budgetTotal: 3000,
        spendCurrent: 1200,
        daysPassed: 21, // 70% days passed
        daysTotal: 30,  // 40% budget spent.
        status: 'underspending',
        recommendation: 'Ritmo lento. Você pode escalar o budget em 50% para bater a meta de investimento.'
    },
    {
        id: '4',
        clientName: 'Construtora Elite - Inst. e Google',
        platform: 'Google',
        budgetTotal: 15000,
        spendCurrent: 10200,
        daysPassed: 21,
        daysTotal: 30,
        status: 'on_track',
        recommendation: 'Dentro do esperado. Acompanhe o CPC no fim de semana.'
    }
];

export default function BudgetPacing() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="CONTROLE DE"
                titleAccent="RITMO"
                subtitle="Acompanhamento inteligente de consumo de verba (Pacing)"
                badge="TRÁFEGO"
            />

            {/* --- SUMMARY CARDS --- */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Investimento Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 23.900</div>
                        <p className="text-xs text-muted-foreground">de R$ 33.000 previstos (72%)</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Contas em Risco</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">2</div>
                        <p className="text-xs text-muted-foreground">1 Acelerada / 1 Lenta</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Dia do Mês</CardTitle>
                        <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">21/30</div>
                        <p className="text-xs text-muted-foreground">70% do período concluído</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- PACING CARDS LIST --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_PACING.map((account) => (
                    <PacingCard key={account.id} account={account} />
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="outline" className="text-muted-foreground">
                    Ver todas as 12 contas conectadas
                </Button>
            </div>
        </div>
    );
}

function PacingCard({ account }: { account: PacingAccount }) {
    // Calculations
    const progressBudget = (account.spendCurrent / account.budgetTotal) * 100;
    const progressTime = (account.daysPassed / account.daysTotal) * 100;

    // Deviation (Positive = Overspending, Negative = Underspending)
    const deviation = progressBudget - progressTime;

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/30">
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur">
                            {account.platform}
                        </Badge>
                        <CardTitle className="text-lg">{account.clientName}</CardTitle>
                    </div>
                    <StatusBadge status={account.status} />
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

                {/* Visual Pacing Indicator */}
                <div className="space-y-4">
                    {/* Budget Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gasto Real</span>
                            <span className="font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.spendCurrent)}
                            </span>
                        </div>
                        <Progress value={progressBudget} className="h-3" indicatorClassName={getStatusColor(account.status)} />
                    </div>

                    {/* Time Bar (Reference) */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Tempo Decorrido (Referência)</span>
                            <span>{Math.round(progressTime)}%</span>
                        </div>
                        <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-zinc-500/30"
                                style={{ width: `${progressTime}%` }}
                            />
                            {/* Pacing Marker */}
                            <div
                                className="absolute top-0 h-full w-0.5 bg-foreground z-10"
                                style={{ left: `${progressTime}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Recommendation Box */}
                <div className={`p-4 rounded-lg flex gap-3 text-sm border ${getAlertStyle(account.status)}`}>
                    <div className="shrink-0 mt-0.5">
                        {account.status === 'on_track' ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium mb-1">Análise de Ritmo</p>
                        <p className="opacity-90 leading-relaxed">
                            {account.recommendation}
                        </p>
                    </div>
                    {account.status !== 'on_track' && (
                        <Button size="sm" variant="outline" className="self-center h-8 bg-transparent border-current opacity-70 hover:opacity-100">
                            Ajustar <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                    )}
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
                    <span>Budget Total: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.budgetTotal)}</strong></span>
                    <span>Projeção Final: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.spendCurrent / progressTime * 100)}</strong></span>
                </div>

            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: PacingAccount['status'] }) {
    switch (status) {
        case 'on_track':
            return (
                <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    No Ritmo
                </div>
            );
        case 'overspending':
            return (
                <div className="flex items-center text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-red-500/20">
                    <TrendingUp className="w-3 h-3 mr-1.5" />
                    Acelerado
                </div>
            );
        case 'underspending':
            return (
                <div className="flex items-center text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                    <TrendingDown className="w-3 h-3 mr-1.5" />
                    Lento
                </div>
            );
        default:
            return null;
    }
}

function getStatusColor(status: PacingAccount['status']) {
    switch (status) {
        case 'on_track': return 'bg-emerald-500';
        case 'overspending': return 'bg-red-500';
        case 'underspending': return 'bg-amber-500';
        default: return 'bg-primary';
    }
}

function getAlertStyle(status: PacingAccount['status']) {
    switch (status) {
        case 'on_track': return 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
        case 'overspending': return 'bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400';
        case 'underspending': return 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400';
        default: return 'bg-muted';
    }
}
