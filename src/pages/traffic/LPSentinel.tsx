import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Plus,
    MoreHorizontal,
    PauseCircle,
    PlayCircle,
    Clock,
    Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// --- MOCK DATA ---
interface MonitoredUrl {
    id: string;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'warning' | 'paused';
    lastCheck: string;
    uptime: number; // percentage
    loadTime: number; // ms
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
    },
    {
        id: '5',
        name: 'Campanha Antiga Q4',
        url: 'https://antigo.com/promo',
        status: 'paused',
        lastCheck: '2 dias atrás',
        uptime: 0,
        loadTime: 0,
        client: 'Império dos Móveis'
    }
];

export default function LPSentinel() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="LP"
                titleAccent="SENTINEL"
                subtitle="Monitoramento de uptime e performance de Landing Pages"
                badge="TRÁFEGO"
            />

            {/* --- TOP STATISTICS --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            URLs Monitoradas
                        </CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 adicionadas hoje
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Online
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">10</div>
                        <p className="text-xs text-muted-foreground">
                            98.2% Uptime Médio
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Offline / Erro
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">1</div>
                        <p className="text-xs text-muted-foreground">
                            Última queda: 12 min
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tempo Médio
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">1.2s</div>
                        <p className="text-xs text-muted-foreground">
                            Meta: &lt; 2.0s
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* --- MAIN ACTION BAR --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Search/Filter could go here */}
                    <div className="h-9 w-64 rounded-md bg-muted/50 border border-border/50 px-3 flex items-center text-sm text-muted-foreground">
                        <span className="opacity-50">Buscar URL ou Cliente...</span>
                    </div>
                </div>
                <Button className="font-semibold shadow-md hover:shadow-lg transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Monitorar Nova URL
                </Button>
            </div>

            {/* --- MONITORING TABLE --- */}
            <div className="rounded-md border border-border/50 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[250px]">Nome / Cliente</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[300px]">URL</TableHead>
                            <TableHead>Performance</TableHead>
                            <TableHead>Última Checagem</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_URLS.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/20">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-foreground font-semibold">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.client}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors max-w-[280px] truncate"
                                    >
                                        <Globe className="mr-2 h-3 w-3 shrink-0" />
                                        {item.url}
                                        <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <LoadTimeIndicator ms={item.loadTime} status={item.status} />
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {item.lastCheck}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem>Ver Relatório Detalhado</DropdownMenuItem>
                                            <DropdownMenuItem>Testar Agora</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {item.status === 'paused' ? (
                                                <DropdownMenuItem className="text-emerald-500">
                                                    <PlayCircle className="mr-2 h-4 w-4" /> Retomar
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="text-amber-500">
                                                    <PauseCircle className="mr-2 h-4 w-4" /> Pausar
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function StatusBadge({ status }: { status: MonitoredUrl['status'] }) {
    switch (status) {
        case 'online':
            return (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                    Online
                </Badge>
            );
        case 'offline':
            return (
                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                    Offline
                </Badge>
            );
        case 'warning':
            return (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
                    Lento
                </Badge>
            );
        case 'paused':
            return (
                <Badge variant="outline" className="text-muted-foreground border-border">
                    Pausado
                </Badge>
            );
        default:
            return null;
    }
}

function LoadTimeIndicator({ ms, status }: { ms: number, status: MonitoredUrl['status'] }) {
    if (status === 'paused' || status === 'offline') return <span className="text-muted-foreground text-xs">-</span>;

    let colorClass = "text-emerald-500";
    if (ms > 2000) colorClass = "text-amber-500";
    if (ms > 4000) colorClass = "text-red-500";

    return (
        <div className="flex flex-col">
            <span className={`font-bold ${colorClass}`}>{ms}ms</span>
            {/* Simple Bar */}
            <div className="h-1 w-16 bg-muted/50 rounded-full mt-1 overflow-hidden">
                <div
                    className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min((ms / 4000) * 100, 100)}%` }} // 4000ms = 100% bar
                />
            </div>
        </div>
    );
}
