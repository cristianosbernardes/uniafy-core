import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Target,
    Link as LinkIcon,
    Copy,
    Check,
    RefreshCw,
    Globe,
    AlertTriangle,
    Activity,
    QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- MOCK DATA ---
interface PixelStatus {
    id: string;
    name: string;
    platform: 'Meta' | 'Google' | 'TikTok';
    pixelId: string;
    status: 'active' | 'inactive' | 'warning';
    lastEvent: string;
    totalEvents: number;
    domain: string;
}

const MOCK_PIXELS: PixelStatus[] = [
    {
        id: '1',
        name: 'Pixel Principal - Padaria',
        platform: 'Meta',
        pixelId: '12837192837',
        status: 'active',
        lastEvent: '2 min atrás',
        totalEvents: 15420,
        domain: 'padariaartesanal.com.br'
    },
    {
        id: '2',
        name: 'Google Ads Conversion',
        platform: 'Google',
        pixelId: 'AW-93812938',
        status: 'active',
        lastEvent: '5 min atrás',
        totalEvents: 8400,
        domain: 'padariaartesanal.com.br'
    },
    {
        id: '3',
        name: 'TikTok Base Pixel',
        platform: 'TikTok',
        pixelId: 'C823719283',
        status: 'warning',
        lastEvent: '2 dias atrás',
        totalEvents: 120,
        domain: 'lp.padariaartesanal.com.br'
    }
];

export default function TrackingManager() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="TRACKING"
                titleAccent="MANAGER"
                subtitle="Construtor de UTMs e monitoramento de Pixels"
                badge="TRÁFEGO"
            />

            <Tabs defaultValue="utm" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="utm">UTM Builder</TabsTrigger>
                    <TabsTrigger value="pixels">Pixel Checker</TabsTrigger>
                </TabsList>

                <TabsContent value="utm" className="mt-6">
                    <UtmBuilder />
                </TabsContent>

                <TabsContent value="pixels" className="mt-6">
                    <PixelChecker />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function UtmBuilder() {
    const [baseUrl, setBaseUrl] = useState("");
    const [source, setSource] = useState("facebook");
    const [medium, setMedium] = useState("cpc");
    const [campaign, setCampaign] = useState("");
    const [content, setContent] = useState("");
    const [term, setTerm] = useState("");
    const [copied, setCopied] = useState(false);

    // Generate URL
    const generateUrl = () => {
        if (!baseUrl) return "";
        try {
            const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
            if (source) url.searchParams.set("utm_source", source);
            if (medium) url.searchParams.set("utm_medium", medium);
            if (campaign) url.searchParams.set("utm_campaign", campaign);
            if (content) url.searchParams.set("utm_content", content);
            if (term) url.searchParams.set("utm_term", term);
            return url.toString();
        } catch (e) {
            return "URL Inválida";
        }
    };

    const finalUrl = generateUrl();

    const handleCopy = () => {
        if (!finalUrl || finalUrl === "URL Inválida") return;
        navigator.clipboard.writeText(finalUrl);
        setCopied(true);
        toast.success("Link rastreado copiado!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* BUILDER FORM */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        Parâmetros da URL
                    </CardTitle>
                    <CardDescription>
                        Configure as tags para rastrear a origem do tráfego.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>URL de Destino (Site)</Label>
                        <Input
                            placeholder="https://seusite.com/oferta"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Origem (Source)</Label>
                            <Select value={source} onValueChange={setSource}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="facebook">Facebook / Instagram</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Mídia (Medium)</Label>
                            <Select value={medium} onValueChange={setMedium}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cpc">CPC (Pago)</SelectItem>
                                    <SelectItem value="organic">Orgânico</SelectItem>
                                    <SelectItem value="referral">Referência</SelectItem>
                                    <SelectItem value="social">Social</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Campanha (Campaign)</Label>
                        <Input
                            placeholder="Ex: black_friday_2024"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Conteúdo (Content) <span className="text-muted-foreground font-normal text-xs">(Opcional)</span></Label>
                            <Input
                                placeholder="Ex: video_01"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Termo (Term) <span className="text-muted-foreground font-normal text-xs">(Opcional)</span></Label>
                            <Input
                                placeholder="Ex: tenis_corrida"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => {
                            setBaseUrl("");
                            setCampaign("");
                            setContent("");
                            setTerm("");
                        }}>
                            <RefreshCw className="w-3 h-3 mr-2" /> Limpar Campos
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* PREVIEW & ACTIONS */}
            <div className="space-y-6">
                <Card className="bg-zinc-950 border-input shadow-xl overflow-hidden ring-1 ring-white/10 sticky top-6">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-zinc-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                            Resultado Final
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="relative group p-4 rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-700 min-h-[100px] flex items-center justify-center text-center break-all">
                            {baseUrl ? (
                                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                                    {finalUrl}
                                </p>
                            ) : (
                                <p className="text-zinc-600 text-sm italic">
                                    Preencha a URL de destino para gerar o link...
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                size="lg"
                                className={`col-span-2 h-12 font-bold shadow-lg transition-all ${copied
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                                onClick={handleCopy}
                                disabled={!baseUrl}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" /> COPIADO!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5 mr-2" /> COPIAR LINK
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" className="text-muted-foreground" disabled={!baseUrl}>
                                <QrCode className="w-4 h-4 mr-2" /> Gerar QR Code
                            </Button>
                            <Button variant="outline" className="text-muted-foreground" disabled={!baseUrl}>
                                <LinkIcon className="w-4 h-4 mr-2" /> Encurtar (Bit.ly)
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* HELP CARD */}
                <Card className="bg-blue-500/5 border-blue-500/10">
                    <CardContent className="p-4 text-sm text-blue-400">
                        <p className="flex items-start gap-2">
                            <span className="font-bold shrink-0">Dica:</span>
                            Sempre use letras minúsculas e substitua espaços por "underline" (_) para evitar erros de leitura nos relatórios.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function PixelChecker() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_PIXELS.map((pixel) => (
                    <Card key={pixel.id} className="border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {pixel.platform}
                            </CardTitle>
                            {pixel.status === 'active' ? (
                                <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20">Ativo</Badge>
                            ) : (
                                <Badge variant="destructive" className="bg-red-500/10">Erro</Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold mb-1">{pixel.name}</div>
                            <p className="text-xs text-muted-foreground font-mono mb-4">ID: {pixel.pixelId}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Activity className="w-3 h-3" /> Eventos (Hoje)
                                    </span>
                                    <span className="font-semibold text-foreground">{pixel.totalEvents.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Domínio
                                    </span>
                                    <span className="font-semibold text-foreground truncate max-w-[120px]">{pixel.domain}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <RefreshCw className="w-3 h-3" /> Último sinal
                                    </span>
                                    <span className="text-emerald-500 font-medium">{pixel.lastEvent}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Pixel Card */}
                <Button variant="outline" className="h-full min-h-[180px] border-dashed border-2 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Target className="w-5 h-5" />
                    </div>
                    <span>Conectar Novo Pixel</span>
                </Button>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="font-bold text-amber-500 text-sm">Atenção: TikTok Base Pixel sem eventos recentes</h4>
                    <p className="text-xs text-amber-400/80">
                        O pixel do TikTok na Landing Page "Ebook Grátis" não recebe eventos há 2 dias. Verifique se o código ainda está instalado corretamente no head do site.
                    </p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto bg-transparent border-amber-500/30 text-amber-500 hover:bg-amber-500/20">
                    Verificar
                </Button>
            </div>
        </div>
    );
}
