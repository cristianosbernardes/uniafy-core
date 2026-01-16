
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe, Palette, Upload, CheckCircle2, RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { agencyService, AgencySettings } from "@/services/agencyService";

export default function AgencyWhiteLabel() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<AgencySettings>({
        custom_domain: "",
        branding_logo: "",
        branding_colors: { primary: "#F97316", secondary: "#000000" }
    });

    useEffect(() => {
        if (user) loadSettings();
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await agencyService.getSettings(user.id);
            if (data) {
                setSettings({
                    custom_domain: data.custom_domain || "",
                    branding_logo: data.branding_logo || "",
                    branding_colors: data.branding_colors || { primary: "#F97316", secondary: "#000000" }
                });
            }
        } catch (error) {
            toast.error("Erro ao carregar configurações.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await agencyService.updateSettings(user.id, settings);
            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar configurações.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDomainCheck = async () => {
        if (!settings.custom_domain) return;
        toast.info("Verificando disponibilidade de DNS...");
        try {
            const available = await agencyService.checkDomainAvailability(settings.custom_domain);
            if (available) {
                toast.success(`Domínio ${settings.custom_domain} disponível para vínculo!`);
            }
        } catch (error) {
            toast.error("Falha ao verificar domínio.");
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="SETUP"
                titleAccent="WHITE LABEL"
                subtitle="Personalize a experiência do seu cliente"
            />
            {loading && <div className="text-xs text-muted-foreground animate-pulse absolute top-4 right-8">Sincronizando...</div>}

            <Tabs defaultValue="domain" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto">
                    <TabsTrigger value="domain" className="px-6 py-2 gap-2 uppercase font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Globe className="w-4 h-4" />
                        Domínio Personalizado
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="px-6 py-2 gap-2 uppercase font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Palette className="w-4 h-4" />
                        Identidade Visual
                    </TabsTrigger>
                </TabsList>

                {/* ABA DE DOMÍNIO */}
                <TabsContent value="domain">
                    <Card className="p-6 bg-black/40 border-white/10 space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <Globe className="w-6 h-6 text-orange-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-orange-500 uppercase text-sm">Acesso Exclusivo</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Configure um subdomínio (ex: <code>app.suaagencia.com</code>) para que seus clientes acessem a plataforma sem ver a marca "Uniafy".
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="domain">Seu Domínio</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="domain"
                                        placeholder="app.seudominio.com"
                                        className="bg-black/50 border-white/10"
                                        value={settings.custom_domain || ""}
                                        onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
                                    />
                                    <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={handleDomainCheck}>
                                        <RotateCw className="w-4 h-4 mr-2" />
                                        Verificar
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground/60">
                                    *Necessário configurar entrada CNAME apontando para <code>whitelabel.uniafy.com</code>
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-white/5">
                            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                                {saving ? "Salvando..." : "Salvar Configuração"}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* ABA DE BRANDING */}
                <TabsContent value="branding">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6 bg-black/40 border-white/10 space-y-6">
                            <h3 className="font-bold text-white uppercase text-sm flex items-center gap-2">
                                <Upload className="w-4 h-4 text-primary" />
                                Logo da Agência
                            </h3>

                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                {settings.branding_logo ? (
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                        <img src={settings.branding_logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSettings({ ...settings, branding_logo: null });
                                            }}
                                        >
                                            Remover
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-white">Clique para fazer upload</p>
                                            <p className="text-xs text-muted-foreground">PNG ou SVG (Max. 2MB)</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <Label>Ou cole a URL da imagem</Label>
                                <Input
                                    placeholder="https://..."
                                    className="bg-black/50 border-white/10"
                                    value={settings.branding_logo || ""}
                                    onChange={(e) => setSettings({ ...settings, branding_logo: e.target.value })}
                                />
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <Card className="p-6 bg-black/40 border-white/10 space-y-6">
                                <h3 className="font-bold text-white uppercase text-sm flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-primary" />
                                    Esquema de Cores
                                </h3>

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Cor Primária (Destaques)</Label>
                                        <div className="flex gap-2">
                                            <div
                                                className="w-10 h-10 rounded-lg border border-white/10 shadow-lg"
                                                style={{ backgroundColor: settings.branding_colors?.primary }}
                                            />
                                            <Input
                                                value={settings.branding_colors?.primary}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    branding_colors: { ...settings.branding_colors!, primary: e.target.value }
                                                })}
                                                className="font-mono uppercase bg-black/50 border-white/10 flex-1"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Cor Secundária (Fundo/Bordas)</Label>
                                        <div className="flex gap-2">
                                            <div
                                                className="w-10 h-10 rounded-lg border border-white/10 shadow-lg"
                                                style={{ backgroundColor: settings.branding_colors?.secondary }}
                                            />
                                            <Input
                                                value={settings.branding_colors?.secondary}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    branding_colors: { ...settings.branding_colors!, secondary: e.target.value }
                                                })}
                                                className="font-mono uppercase bg-black/50 border-white/10 flex-1"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-black/60 border border-white/5">
                                    <p className="text-xs text-muted-foreground mb-3 uppercase font-bold tracking-wider">Preview do Botão</p>
                                    <Button
                                        className="w-full font-bold shadow-lg transition-transform hover:scale-[1.02]"
                                        style={{
                                            backgroundColor: settings.branding_colors?.primary,
                                            color: '#fff' // Idealmente calcular contraste
                                        }}
                                    >
                                        Exemplo de Ação
                                    </Button>
                                </div>
                            </Card>

                            <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-lg uppercase font-black tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                                {saving ? <RotateCw className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                {saving ? "Salvando..." : "Salvar e Aplicar"}
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
