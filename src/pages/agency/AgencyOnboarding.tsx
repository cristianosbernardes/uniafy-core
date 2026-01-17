
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { agencyService } from "@/services/agencyService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Palette, Globe, CheckCircle2, ArrowRight } from "lucide-react";

export default function AgencyOnboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Step Control: 1=Identity, 2=Branding, 3=Domain
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [data, setData] = useState({
        agencyName: "",
        navLogo: "",
        primaryColor: "#F97316", // Default Orange
        customDomain: ""
    });

    const handleNext = async () => {
        if (step === 1 && !data.agencyName) {
            toast.error("Por favor, informe o nome da sua agência.");
            return;
        }

        if (step === 3) {
            await finishOnboarding();
        } else {
            setStep(s => s + 1);
        }
    };

    const finishOnboarding = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Update Profile/Branding
            await agencyService.updateSettings(user.id, {
                branding_logo: data.navLogo,
                branding_colors: { primary: data.primaryColor, secondary: "#000000" },
                custom_domain: data.customDomain || null
            });

            // 2. Mark Onboarding as Complete (Mock or Real Field)
            // Ideally we'd have a flag 'onboarding_completed' in profiles

            toast.success("Agência configurada com sucesso!");
            navigate("/agency/clients"); // Go to main dashboard
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-[#050505] to-[#050505] -z-10 pointer-events-none" />

            <div className="w-full max-w-2xl space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 animate-in zoom-in duration-500">
                        <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                        Configuração da Agência
                    </h1>
                    <p className="text-zinc-400">Vamos personalizar a plataforma para a sua marca em poucos passos.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-12 bg-primary' : 'w-4 bg-zinc-800'}`} />
                    ))}
                </div>

                {/* Card Content */}
                <Card className="bg-[#111] border-white/10 p-8 shadow-2xl">

                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <div className="space-y-2">
                                <Label className="text-lg">Qual o nome da sua Agência?</Label>
                                <Input
                                    className="h-14 text-xl bg-black/50 border-white/10"
                                    placeholder="Ex: Rocket Marketing"
                                    value={data.agencyName}
                                    onChange={e => setData({ ...data, agencyName: e.target.value })}
                                    autoFocus
                                />
                                <p className="text-xs text-zinc-500">Esse nome aparecerá nos relatórios e painéis dos clientes.</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: BRANDING */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Cor Primária</Label>
                                        <div className="flex gap-2">
                                            <div className="w-12 h-12 rounded border border-white/10" style={{ backgroundColor: data.primaryColor }} />
                                            <Input
                                                className="h-12 font-mono uppercase bg-black/50 border-white/10"
                                                value={data.primaryColor}
                                                onChange={e => setData({ ...data, primaryColor: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>URL do Logo (Opcional)</Label>
                                        <Input
                                            className="bg-black/50 border-white/10"
                                            placeholder="https://..."
                                            value={data.navLogo}
                                            onChange={e => setData({ ...data, navLogo: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="bg-black/50 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center gap-4">
                                    <Label className="text-xs uppercase tracking-widest text-zinc-500">Preview do Botão</Label>
                                    <Button
                                        style={{ backgroundColor: data.primaryColor }}
                                        className="w-full font-bold shadow-lg"
                                    >
                                        Acessar Plataforma
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DOMAIN */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-4">
                                <Globe className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white text-sm uppercase">White Label Flexível</h4>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Você pode configurar um domínio próprio (ex: app.suaagencia.com) agora ou a qualquer momento no menu de configurações.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Domínio Personalizado (Opcional)</Label>
                                <Input
                                    className="h-12 bg-black/50 border-white/10"
                                    placeholder="app.suaagencia.com"
                                    value={data.customDomain}
                                    onChange={e => setData({ ...data, customDomain: e.target.value })}
                                />
                                <p className="text-[10px] text-zinc-500">
                                    Requer configuração de CNAME para <code>whitelabel.uniafy.com</code>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-white">
                                Voltar
                            </Button>
                        ) : <div />}

                        <Button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-white text-black hover:bg-zinc-200 font-bold px-8"
                        >
                            {step === 3 ? (loading ? "Salvando..." : "Concluir Setup") : "Próximo"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
}
