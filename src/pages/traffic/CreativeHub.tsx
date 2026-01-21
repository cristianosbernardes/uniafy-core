import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Image as ImageIcon,
    Video,
    Filter,
    Upload,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Download,
    Clock,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- MOCK DATA ---
interface CreativeAsset {
    id: string;
    title: string;
    type: 'image' | 'video';
    url: string; // Placeholder image URL
    status: 'approved' | 'rejected' | 'pending';
    client: string;
    date: string;
    dimensions: string;
}

const MOCK_ASSETS: CreativeAsset[] = [
    {
        id: '1',
        title: 'Story VSL Oferta Black',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
        status: 'pending',
        client: 'Padaria Artesanal',
        date: 'Hoje',
        dimensions: '1080x1920'
    },
    {
        id: '2',
        title: 'Feed Carrossel Capa',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?w=800&q=80',
        status: 'approved',
        client: 'Tech Solutions',
        date: 'Ontem',
        dimensions: '1080x1080'
    },
    {
        id: '3',
        title: 'Banner Remarketing',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        status: 'rejected',
        client: 'Clínica Dr. João',
        date: '19/05',
        dimensions: '1200x628'
    },
    {
        id: '4',
        title: 'Reels Depoimento',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        status: 'approved',
        client: 'Construtora Elite',
        date: '18/05',
        dimensions: '1080x1920'
    },
    {
        id: '5',
        title: 'Foto Produto Promo',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        status: 'pending',
        client: 'Padaria Artesanal',
        date: '18/05',
        dimensions: '1080x1080'
    },
    {
        id: '6',
        title: 'Background Stories',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
        status: 'approved',
        client: 'Tech Solutions',
        date: '17/05',
        dimensions: '1080x1920'
    }
];

export default function CreativeHub() {
    const [activeTab, setActiveTab] = useState("all");

    // Filter logic would go here
    const filteredAssets = activeTab === "all"
        ? MOCK_ASSETS
        : MOCK_ASSETS.filter(a => a.type === activeTab || a.status === activeTab);

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex-none space-y-4 mb-6">
                <PageHeader
                    title="CENTRAL DE"
                    titleAccent="CRIATIVOS"
                    subtitle="Gestão, organização e aprovação de ativos visuais"
                    badge="TRÁFEGO"
                />

                {/* --- TOOLBAR --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border/50 shadow-sm">

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar criativo..." className="pl-9 bg-background/50 border-border/50" />
                        </div>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="all">Todos</TabsTrigger>
                                <TabsTrigger value="image">Imagens</TabsTrigger>
                                <TabsTrigger value="video">Vídeos</TabsTrigger>
                                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all">
                            <Upload className="h-4 w-4" />
                            <span className="hidden sm:inline">Upload</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- GALLERY GRID --- */}
            <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    {filteredAssets.map((asset) => (
                        <CreativeCard key={asset.id} asset={asset} />
                    ))}

                    {/* Add New Quick Card */}
                    <div className="group relative flex flex-col items-center justify-center h-[320px] rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6" />
                        </div>
                        <p className="mt-3 font-medium text-muted-foreground group-hover:text-foreground">Adicionar Novo</p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

function CreativeCard({ asset }: { asset: CreativeAsset }) {
    return (
        <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all hover:border-primary/30 flex flex-col">

            {/* Image Preview Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-0 hover:bg-black/70">
                        {asset.type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                        {asset.type.toUpperCase()}
                    </Badge>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={asset.status} />
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 hover:bg-emerald-500 text-white hover:text-white transition-colors" title="Aprovar">
                        <CheckCircle2 className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 hover:bg-red-500 text-white hover:text-white transition-colors" title="Rejeitar">
                        <XCircle className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" title="Baixar">
                        <Download className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Info Footer */}
            <div className="p-4 flex flex-col gap-1">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground truncate pr-2" title={asset.title}>
                        {asset.title}
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{asset.client}</span>
                    <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {asset.date}
                    </span>
                </div>

                <div className="mt-2 text-[10px] text-muted-foreground/70 uppercase font-mono tracking-wider">
                    {asset.dimensions}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: CreativeAsset['status'] }) {
    switch (status) {
        case 'approved':
            return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">APROVADO</Badge>;
        case 'rejected':
            return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white border-0">REJEITADO</Badge>;
        case 'pending':
            return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white border-0">PENDENTE</Badge>;
        default:
            return null;
    }
}
