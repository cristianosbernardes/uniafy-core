import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    Copy,
    Type,
    Check,
    RefreshCw,
    Settings2
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
import { toast } from "sonner";

export default function NamingGovernor() {
    const [copied, setCopied] = useState(false);

    // --- STATE ---
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
    const [network, setNetwork] = useState("META");
    const [objective, setObjective] = useState("CONV");
    const [product, setProduct] = useState("");
    const [audience, setAudience] = useState("ABERTO");
    const [creativeType, setCreativeType] = useState("IMG");
    const [creativeId, setCreativeId] = useState("01");

    // --- GENERATED NAME ---
    // Format: DATE_NETWORK_OBJECTIVE_PRODUCT_AUDIENCE_CREATIVE
    const generatedName = `${date}_${network}_${objective}_${product || 'PRODUTO'}_${audience}_${creativeType}${creativeId}`.toUpperCase();

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedName);
        setCopied(true);
        toast.success("Nome da campanha copiado!", {
            description: generatedName
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <PageHeader
                title="GOVERNADOR DE"
                titleAccent="NOMENCLATURA"
                subtitle="Padronização obrigatória de nomes para campanhas organizadas"
                badge="TRÁFEGO"
            />

            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* --- LEFT: BUILDER FORM --- */}
                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-primary" />
                            Construtor de Nome
                        </CardTitle>
                        <CardDescription>
                            Preencha os campos para gerar o padrão oficial.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Data</Label>
                                <Input
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="YYYYMMDD"
                                    className="font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rede / Canal</Label>
                                <Select value={network} onValueChange={setNetwork}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="META">Meta Ads</SelectItem>
                                        <SelectItem value="GGL">Google Ads</SelectItem>
                                        <SelectItem value="TK">TikTok</SelectItem>
                                        <SelectItem value="PIN">Pinterest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Objetivo da Campanha</Label>
                            <Select value={objective} onValueChange={setObjective}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CONV">Conversão / Venda</SelectItem>
                                    <SelectItem value="LEAD">Captação de Leads</SelectItem>
                                    <SelectItem value="TRAF">Tráfego / Cliques</SelectItem>
                                    <SelectItem value="ALC">Alcance / Branding</SelectItem>
                                    <SelectItem value="MSG">Mensagens (Direct/Whats)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Produto / Oferta (Sigla)</Label>
                            <Input
                                value={product}
                                onChange={(e) => setProduct(e.target.value.toUpperCase())}
                                placeholder="Ex: EBOOK, MENTORIA, BLACKFRIDAY"
                                className="uppercase font-medium"
                            />
                            <p className="text-[10px] text-muted-foreground">Use siglas curtas. Ex: BF24 para Black Friday 2024.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Público</Label>
                                <Select value={audience} onValueChange={setAudience}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ABERTO">Aberto / Broad</SelectItem>
                                        <SelectItem value="LAL1%">Lookalike 1%</SelectItem>
                                        <SelectItem value="LAL5%">Lookalike 5%</SelectItem>
                                        <SelectItem value="ENV">Envolvimento 30D</SelectItem>
                                        <SelectItem value="SITE">Visitantes Site 30D</SelectItem>
                                        <SelectItem value="INT">Interesses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>Tipo Cr.</Label>
                                    <Select value={creativeType} onValueChange={setCreativeType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IMG">Imagem</SelectItem>
                                            <SelectItem value="VID">Vídeo</SelectItem>
                                            <SelectItem value="CAR">Carrossel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>ID</Label>
                                    <Input
                                        value={creativeId}
                                        onChange={(e) => setCreativeId(e.target.value)}
                                        placeholder="01"
                                        className="font-mono text-center"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => {
                                setDate(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
                                setNetwork("META");
                                setObjective("CONV");
                                setProduct("");
                                setAudience("ABERTO");
                                setCreativeType("IMG");
                                setCreativeId("01");
                            }}>
                                <RefreshCw className="w-3 h-3 mr-2" /> Resetar
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* --- RIGHT: PREVIEW & ACTIONS --- */}
                <div className="space-y-6 sticky top-6">

                    {/* RESULT CARD */}
                    <Card className="bg-zinc-950 border-input shadow-2xl overflow-hidden ring-1 ring-white/10">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-zinc-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Type className="w-4 h-4" /> Resultado Final
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="relative group p-6 rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-700">
                                <p className="font-mono text-xl sm:text-2xl break-all text-center text-emerald-400 font-bold tracking-tight">
                                    {generatedName}
                                </p>
                            </div>

                            <Button
                                size="lg"
                                className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${copied
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-6 h-6 mr-2 animate-bounce" /> COPIADO!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-6 h-6 mr-2" /> COPIAR NOME
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-zinc-500">
                                Clique para copiar e cole diretamente no Gerenciador de Anúncios.
                            </p>

                        </CardContent>
                    </Card>

                    {/* HISTORY (Placeholder) */}
                    <div className="bg-card/50 rounded-xl p-4 border border-border/50">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Últimos Gerados</h4>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-muted-foreground p-2 rounded bg-background/50 border border-border/30 truncate hover:text-foreground cursor-pointer transition-colors">
                                20240520_META_CONV_MENTORIA_LAL1%_VID03
                            </div>
                            <div className="text-xs font-mono text-muted-foreground p-2 rounded bg-background/50 border border-border/30 truncate hover:text-foreground cursor-pointer transition-colors">
                                20240520_GGL_LEAD_EBOOK_ABERTO_IMG01
                            </div>
                            <div className="text-xs font-mono text-muted-foreground p-2 rounded bg-background/50 border border-border/30 truncate hover:text-foreground cursor-pointer transition-colors">
                                20240519_TK_ALC_BRANDING_INT_VID12
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
