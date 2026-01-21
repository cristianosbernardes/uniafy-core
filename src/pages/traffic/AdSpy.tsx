import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Eye,
    Search,
    Link,
    Plus,
    Heart,
    Bookmark,
    Share2,
    Download,
    PlayCircle,
    Copy,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";

// --- MOCK DATA ---
interface AdReference {
    id: string;
    title: string;
    description: string;
    thumbnail: string; // URL da imagem/vídeo
    type: 'video' | 'image' | 'carousel';
    platform: 'Meta' | 'TikTok' | 'YouTube';
    tags: string[];
    likes: number;
    isSaved: boolean;
}

const MOCK_ADS: AdReference[] = [
    {
        id: '1',
        title: 'Hook VSL "Semana Black"',
        description: 'Exemplo de gancho forte nos primeiros 3s usando texto nativo.',
        thumbnail: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80',
        type: 'video',
        platform: 'TikTok',
        tags: ['VSL', 'E-commerce', 'Black Friday'],
        likes: 124,
        isSaved: true
    },
    {
        id: '2',
        title: 'Carrossel "Dores do Cliente"',
        description: 'Estrutura AIDA clássica em 5 cards. Ótimo para feed.',
        thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80',
        type: 'carousel',
        platform: 'Meta',
        tags: ['Carrossel', 'B2B', 'SaaS'],
        likes: 89,
        isSaved: false
    },
    {
        id: '3',
        title: 'UGC Unboxing Real',
        description: 'Estilo bem amador, gera muita conexão. Formato 9:16.',
        thumbnail: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80',
        type: 'video',
        platform: 'Meta',
        tags: ['UGC', 'Beleza', 'Stories'],
        likes: 450,
        isSaved: true
    },
    {
        id: '4',
        title: 'Thumb Clickbait "Segredo"',
        description: 'Uso de seta vermelha e rosto surpreso. Alto CTR.',
        thumbnail: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=800&q=80',
        type: 'image',
        platform: 'YouTube',
        tags: ['Thumb', 'Infoproduto'],
        likes: 72,
        isSaved: false
    },
    {
        id: '5',
        title: 'Anúncio de "Depoimento"',
        description: 'Prova social forte com prints de WhatsApp.',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        type: 'image',
        platform: 'Meta',
        tags: ['Prova Social', 'Serviços'],
        likes: 210,
        isSaved: false
    }
];

export default function AdSpy() {
    const [ads, setAds] = useState(MOCK_ADS);
    const [searchTerm, setSearchTerm] = useState("");
    const [newLink, setNewLink] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Toggle Saved Status
    const toggleSave = (id: string) => {
        setAds(ads.map(ad =>
            ad.id === id ? { ...ad, isSaved: !ad.isSaved } : ad
        ));
        toast.info(ads.find(a => a.id === id)?.isSaved ? "Removido dos salvos" : "Salvo na biblioteca!");
    };

    // Filter Logic
    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = activeFilter === "all" ? true :
            activeFilter === "saved" ? ad.isSaved :
                activeFilter === "video" ? ad.type === "video" :
                    ad.platform.toLowerCase() === activeFilter.toLowerCase(); // Simple mapping

        return matchesSearch && matchesFilter;
    });

    const handleAddLink = () => {
        if (!newLink) return;
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Analisando link do anúncio...',
            success: 'Anúncio importado com sucesso!',
            error: 'Erro ao importar link'
        });
        setNewLink("");
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex-none space-y-4 mb-6">
                <PageHeader
                    title="AD"
                    titleAccent="SPY"
                    subtitle="Banco de referências e espionagem de anúncios"
                    badge="TRÁFEGO"
                />

                {/* --- HERO INPUT AREA --- */}
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 rounded-xl border border-border/50 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full space-y-2">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Link className="w-5 h-5 text-primary" />
                                Importar Referência
                            </h3>
                            <div className="flex gap-2">
                                <Input
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="Cole o link da Biblioteca de Anúncios (Meta, TikTok, YouTube)..."
                                    className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 h-11"
                                />
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="h-11 px-8 shadow-primary/25 shadow-lg shrink-0 w-full md:w-auto font-bold"
                            onClick={handleAddLink}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            SALVAR NA BIBLIOTECA
                        </Button>
                    </div>
                </div>

                {/* --- CONTROLS --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
                    <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
                        <TabsList className="bg-muted/50 h-9">
                            <TabsTrigger value="all">Todas</TabsTrigger>
                            <TabsTrigger value="saved" className="data-[state=active]:text-primary"><Bookmark className="w-3 h-3 mr-1.5" /> Salvas</TabsTrigger>
                            <TabsTrigger value="video">Vídeos</TabsTrigger>
                            <TabsTrigger value="meta">Meta</TabsTrigger>
                            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por tag, título..."
                            className="pl-9 h-9 bg-background/50 border-border/50"
                        />
                    </div>
                </div>
            </div>

            {/* --- MASONRY GRID --- */}
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 pb-12 space-y-4">
                    {filteredAds.map((ad) => (
                        <div key={ad.id} className="break-inside-avoid">
                            <AdCard ad={ad} onToggleSave={toggleSave} />
                        </div>
                    ))}

                    {/* Empty State Help */}
                    {filteredAds.length === 0 && (
                        <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground break-inside-avoid">
                            Nenhum anúncio encontrado.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function AdCard({ ad, onToggleSave }: { ad: AdReference; onToggleSave: (id: string) => void }) {
    return (
        <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            {/* THUMBNAIL AREA */}
            <div className="relative cursor-pointer">
                <img
                    src={ad.thumbnail}
                    alt={ad.title}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Type Icon */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur rounded-full p-1.5 text-white border border-white/10">
                    {ad.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center bg-black/60 backdrop-blur-sm">
                    <PlatformBadge platform={ad.platform} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold leading-tight text-foreground line-clamp-2" title={ad.title}>
                        {ad.title}
                    </h4>
                    <button
                        onClick={() => onToggleSave(ad.id)}
                        className={`shrink-0 transition-colors ${ad.isSaved ? "text-primary fill-primary" : "text-muted-foreground hover:text-primary"}`}
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3">
                    {ad.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                    {ad.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground uppercase">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Footer Meta */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {ad.likes}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/10 hover:text-primary transition-colors">
                        <Copy className="w-3 h-3 mr-1" /> Copiar ID
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PlatformBadge({ platform }: { platform: AdReference['platform'] }) {
    let colors = "bg-zinc-500";
    if (platform === 'Meta') colors = "bg-blue-600";
    if (platform === 'TikTok') colors = "bg-black border border-white/20";
    if (platform === 'YouTube') colors = "bg-red-600";

    return (
        <Badge className={`${colors} hover:${colors} text-white border-none px-2 py-0.5 text-[10px]`}>
            {platform}
        </Badge>
    );
}
