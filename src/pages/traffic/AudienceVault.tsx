import React from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    MapPin,
    Search,
    Database,
    Plus,
    FileJson,
    Smartphone,
    Globe,
    Upload,
    Fingerprint
} from "lucide-react";

export default function AudienceVault() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="COFRE DE"
                titleAccent="PÚBLICOS"
                subtitle="Biblioteca de personas, segmentação e geolocalização"
                badge="TRÁFEGO"
            />

            <Tabs defaultValue="list" className="space-y-8">
                <TabsList className="grid w-full md:w-[600px] grid-cols-4 bg-zinc-900/50 border border-white/5">
                    <TabsTrigger value="list">Meus Públicos</TabsTrigger>
                    <TabsTrigger value="create">Criar & IDs</TabsTrigger>
                    <TabsTrigger value="geo">Geo-Intel</TabsTrigger>
                    <TabsTrigger value="enrich">Dados & Enrich</TabsTrigger>
                </TabsList>

                {/* TAB 1: LIST */}
                <TabsContent value="list" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AudienceCard
                            name="Compradores 30D"
                            type="Custom Audience"
                            size="12,402"
                            platform="Meta"
                            status="ready"
                        />
                        <AudienceCard
                            name="Lookalike 1% (Compradores)"
                            type="Lookalike"
                            size="1,802,000"
                            platform="Meta"
                            status="ready"
                        />
                        <AudienceCard
                            name="Visitantes Site 7D"
                            type="Custom Audience"
                            size="4,200"
                            platform="Google"
                            status="populating"
                        />
                        <Card className="border-dashed border-2 border-zinc-800 bg-transparent flex flex-col items-center justify-center p-6 text-zinc-500 hover:border-zinc-600 hover:bg-white/5 transition-all cursor-pointer group min-h-[180px]">
                            <Plus className="w-10 h-10 mb-4 group-hover:text-primary transition-colors" />
                            <span className="font-medium text-sm">Criar Novo Público</span>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB 2: CREATE & IDs */}
                <TabsContent value="create">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Público Personalizado
                                </CardTitle>
                                <CardDescription>Crie públicos baseados em listas de clientes (CSV/TXT).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome do Público</Label>
                                    <Input placeholder="Ex: Lista Clientes BlackFriday" />
                                </div>
                                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:bg-white/5 cursor-pointer transition-all">
                                    <Upload className="w-8 h-8 mb-3" />
                                    <p className="text-sm">Arraste seu arquivo CSV ou TXT aqui</p>
                                    <p className="text-[10px] text-zinc-600 mt-1">Suporta: email, phone, gen, dob...</p>
                                </div>
                                <Button className="w-full">Processar Arquivo</Button>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-purple-500" />
                                    IDs Manuais
                                </CardTitle>
                                <CardDescription>Insira IDs de público manualmente do gerenciador.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome Identificador</Label>
                                    <Input placeholder="Ex: Audience VIP ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label>ID do Público (Meta/Google)</Label>
                                    <Input placeholder="Ex: 23847281923..." className="font-mono" />
                                </div>
                                <div className="p-4 bg-purple-500/10 rounded-lg text-xs text-purple-300">
                                    <p>Ao salvar um ID manual, ele ficará disponível para seleção rápida no Campaign Builder.</p>
                                </div>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">Salvar ID</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB 3: GEO-INTEL */}
                <TabsContent value="geo">
                    <Card className="border-border/50 max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                Geo Intelligence (Discovery)
                            </CardTitle>
                            <CardDescription>Descubra as melhores localizações para seus anúncios locais.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Endereço Central</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                                            <Input placeholder="Av. Paulista, 1000 - São Paulo" className="pl-9" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label>Raio (km)</Label>
                                    <Input type="number" defaultValue={5} />
                                </div>
                                <div className="pt-8">
                                    <Button className="bg-blue-600 text-white">
                                        <Search className="w-4 h-4 mr-2" /> Analisar
                                    </Button>
                                </div>
                            </div>

                            <div className="h-[300px] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-46.633, -23.550,12,0/800x600?access_token=pk.xxx')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all" />
                                <div className="relative z-10 text-center space-y-2">
                                    <MapPin className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
                                    <p className="text-sm font-medium text-white">Seu mapa de calor aparecerá aqui</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-zinc-900 rounded-lg border border-white/5 text-center">
                                    <span className="block text-2xl font-bold text-white">450k</span>
                                    <span className="text-xs text-zinc-500 uppercase">Público Estimado</span>
                                </div>
                                <div className="p-4 bg-zinc-900 rounded-lg border border-white/5 text-center">
                                    <span className="block text-2xl font-bold text-emerald-500">A+</span>
                                    <span className="text-xs text-zinc-500 uppercase">Potencial de Renda</span>
                                </div>
                                <div className="p-4 bg-zinc-900 rounded-lg border border-white/5 text-center">
                                    <span className="block text-2xl font-bold text-blue-500">22</span>
                                    <span className="text-xs text-zinc-500 uppercase">Concorrentes Próximos</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 4: ENRICH (Dados) */}
                <TabsContent value="enrich">
                    <Card className="border-border/50 max-w-3xl mx-auto mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-sky-500" />
                                Telegram Data Enrichment
                            </CardTitle>
                            <CardDescription>
                                Consulte dados enriquecidos de leads usando a base de dados do Telegram.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-6 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-start gap-4">
                                <div className="p-2 bg-sky-500/20 rounded-lg shrink-0">
                                    <Fingerprint className="w-6 h-6 text-sky-400" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sky-400">Como funciona?</h4>
                                    <p className="text-sm text-sky-200/70">
                                        Digite o número do telefone ou @username do lead. O sistema buscará informações públicas disponíveis no Telegram (Foto, Bio, Nome Real, ID) para enriquecer o CRM.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Input placeholder="@username ou +5511999999999" className="h-12 text-lg font-mono bg-black/40" />
                                <Button size="lg" className="h-12 px-8 bg-sky-600 hover:bg-sky-700">
                                    <Search className="w-5 h-5 mr-2" /> Consultar
                                </Button>
                            </div>

                            <div className="border-t border-white/5 pt-6">
                                <div className="flex items-center justify-center p-12 text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                                    <div className="text-center">
                                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Os resultados da consulta aparecerão aqui.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AudienceCard({ name, type, size, platform, status }: any) {
    return (
        <Card className="border-border/50 hover:border-primary/50 transition-colors group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <Badge variant="outline" className="mb-2">{platform}</Badge>
                {status === 'ready' ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Pronto" />
                ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Preenchendo..." />
                )}
            </CardHeader>
            <CardContent>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-sm text-zinc-500 mb-4">{type}</p>

                <div className="flex items-center justify-between text-xs border-t border-white/5 pt-4">
                    <span className="text-zinc-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Tamanho
                    </span>
                    <span className="font-mono text-white">{size}</span>
                </div>
            </CardContent>
        </Card>
    );
}
