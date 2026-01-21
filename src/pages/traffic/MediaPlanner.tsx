import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    PieChart,
    Calculator,
    TrendingUp,
    Users,
    Target,
    DollarSign,
    Save,
    RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MediaPlanner() {
    // --- STATE: INPUTS ---
    const [budget, setBudget] = useState(5000);
    const [cpm, setCpm] = useState(15); // Cost per Mille
    const [ctr, setCtr] = useState(1.5); // Click Through Rate (%)
    const [convRateLP, setConvRateLP] = useState(10); // LP to Lead (%)
    const [convRateSales, setConvRateSales] = useState(5); // Lead to Sale (%)
    const [ticket, setTicket] = useState(197); // Average Ticket

    // --- CALCULATIONS ---
    const impressions = (budget / cpm) * 1000;
    const clicks = impressions * (ctr / 100);
    const cpc = budget / clicks;

    // Funnel
    const leads = clicks * (convRateLP / 100);
    const cpl = budget / leads;

    const sales = leads * (convRateSales / 100);
    const cac = budget / sales;

    const revenue = sales * ticket;
    const roas = revenue / budget;
    const profit = revenue - budget;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <PageHeader
                title="PLANEJADOR DE"
                titleAccent="MÍDIA"
                subtitle="Simulador de cenários e calculadora de ROI preditiva"
                badge="TRÁFEGO"
            />

            <div className="grid lg:grid-cols-12 gap-8">

                {/* --- LEFT: CONTROLS (INPUTS) --- */}
                <Card className="lg:col-span-4 h-fit border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-primary" />
                            Premissas do Cenário
                        </CardTitle>
                        <CardDescription>
                            Ajuste os indicadores baseados no histórico.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        {/* Budget Input */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label>Orçamento Mensal (R$)</Label>
                                <span className="font-bold text-primary">R$ {budget.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[budget]}
                                max={50000}
                                step={500}
                                onValueChange={(v) => setBudget(v[0])}
                                className="py-2"
                            />
                        </div>

                        <Separator />

                        {/* Metrics Inputs */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>CPM Esperado (R$)</Label>
                                    <span className="text-muted-foreground font-mono">R$ {cpm}</span>
                                </div>
                                <Slider
                                    value={[cpm]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setCpm(v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>CTR Médio (%)</Label>
                                    <span className="text-muted-foreground font-mono">{ctr}%</span>
                                </div>
                                <Slider
                                    value={[ctr]}
                                    max={10}
                                    step={0.1}
                                    onValueChange={(v) => setCtr(v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Conv. LP → Lead (%)</Label>
                                    <span className="text-muted-foreground font-mono">{convRateLP}%</span>
                                </div>
                                <Slider
                                    value={[convRateLP]}
                                    max={60}
                                    step={1}
                                    onValueChange={(v) => setConvRateLP(v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Conv. Lead → Venda (%)</Label>
                                    <span className="text-muted-foreground font-mono">{convRateSales}%</span>
                                </div>
                                <Slider
                                    value={[convRateSales]}
                                    max={30}
                                    step={0.5}
                                    onValueChange={(v) => setConvRateSales(v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Ticket Médio (R$)</Label>
                                    <span className="text-muted-foreground font-mono">R$ {ticket}</span>
                                </div>
                                <Slider
                                    value={[ticket]}
                                    max={2000}
                                    step={10}
                                    onValueChange={(v) => setTicket(v[0])}
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <Button className="w-full font-bold shadow-lg" onClick={() => { }}>
                                <Save className="w-4 h-4 mr-2" /> Salvar Cenário
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => {
                                setBudget(5000);
                                setCpm(15);
                                setCtr(1.5);
                                setConvRateLP(10);
                                setConvRateSales(5);
                                setTicket(197);
                            }}>
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* --- RIGHT: RESULTS (DASHBOARD) --- */}
                <div className="lg:col-span-8 space-y-6">

                    {/* TOP LEVEL METRICS (REVENUE) */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <ResultCard
                            title="Faturamento Projetado"
                            value={`R$ ${revenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                            subtext={`ROI Estimado (Lucro): R$ ${profit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                            trend={profit > 0 ? "positive" : "negative"}
                            icon={DollarSign}
                            highlight
                        />
                        <ResultCard
                            title="ROAS Esperado"
                            value={`${roas.toFixed(2)}x`}
                            subtext="Retorno sobre Ad Spend"
                            trend={roas > 2 ? "positive" : roas < 1 ? "negative" : "neutral"}
                            icon={TrendingUp}
                        />
                        <ResultCard
                            title="Custo por Venda (CAC)"
                            value={`R$ ${cac.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
                            subtext={`Margem de contribuição: R$ ${(ticket - cac).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                            trend={cac < ticket ? "positive" : "negative"}
                            icon={Target}
                        />
                    </div>

                    {/* FUNNEL VISUALIZATION */}
                    <Card className="border-border/50 bg-gradient-to-br from-zinc-900 to-zinc-950/50">
                        <CardHeader>
                            <CardTitle>Funil de Conversão Estimado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <FunnelStep
                                    label="Impressões (Alcance)"
                                    value={impressions.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    subval={`CPM R$ ${cpm}`}
                                    width="100%"
                                    color="bg-zinc-700"
                                />
                                <FunnelStep
                                    label="Cliques (Tráfego)"
                                    value={clicks.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    subval={`CPC R$ ${cpc.toFixed(2)}`}
                                    width={`${Math.max(ctr * 2, 80)}%`} // visual scaling hack
                                    color="bg-blue-600"
                                />
                                <FunnelStep
                                    label="Leads (Oportunidades)"
                                    value={leads.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    subval={`CPL R$ ${cpl.toFixed(2)}`}
                                    width={`${Math.max((ctr * (convRateLP / 100)) * 1000, 60)}%`} // visual hack
                                    color="bg-amber-500"
                                />
                                <FunnelStep
                                    label="Vendas (Clientes)"
                                    value={sales.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    subval={`${convRateSales}% de conversão`}
                                    width="40%"
                                    color="bg-emerald-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ALERTS / INSIGHTS */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-border/50 bg-blue-500/5">
                            <CardContent className="p-4 flex gap-4">
                                <div className="shrink-0 pt-1">
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">INFO</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-100">Ponto de Equilíbrio (Breakeven)</p>
                                    <p className="text-xs text-blue-200/70 leading-relaxed">
                                        Para não ter prejuízo, você precisa manter o CAC abaixo de <strong>R$ {ticket}</strong>.
                                        No cenário atual, seu CAC estimado é <strong>R$ {cac.toFixed(0)}</strong>.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 bg-emerald-500/5">
                            <CardContent className="p-4 flex gap-4">
                                <div className="shrink-0 pt-1">
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">DICA</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-emerald-100">Potencial de Escala</p>
                                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                                        Se você aumentar a conversão da LP para <strong>{(convRateLP * 1.2).toFixed(0)}%</strong>,
                                        seu faturamento subiria para <strong>R$ {(revenue * 1.2).toLocaleString()}</strong> com o mesmo budget.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function ResultCard({ title, value, subtext, trend, icon: Icon, highlight }: any) {
    return (
        <Card className={`border-border/50 ${highlight ? 'bg-primary/5 border-primary/20' : ''}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-zinc-500'}`} />
                </div>
                <div className="text-2xl font-bold mb-1">{value}</div>
                <p className={`text-xs flex items-center gap-1 ${trend === 'positive' ? 'text-emerald-500' :
                        trend === 'negative' ? 'text-red-500' : 'text-zinc-500'
                    }`}>
                    {subtext}
                </p>
            </CardContent>
        </Card>
    );
}

function FunnelStep({ label, value, subval, width, color }: any) {
    return (
        <div className="relative group">
            <div className="flex items-end justify-between text-sm mb-1 px-1">
                <span className="text-muted-foreground font-medium">{label}</span>
                <div className="text-right">
                    <span className="font-bold block">{value}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{subval}</span>
                </div>
            </div>

            <div className="h-8 w-full bg-zinc-800/50 rounded-md overflow-hidden relative">
                <div
                    className={`h-full ${color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center px-2`}
                    style={{ width }}
                >
                </div>
            </div>
            {/* Connector Line (visual only) */}
            <div className="h-4 w-0.5 bg-zinc-800 mx-auto my-[-2px] relative z-0" />
        </div>
    );
}
