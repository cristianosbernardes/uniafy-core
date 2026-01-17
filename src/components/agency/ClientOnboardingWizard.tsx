
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, ChevronLeft, Rocket, Target, DollarSign, Globe, Briefcase, Mail, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClientOnboardingWizardProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

export function ClientOnboardingWizard({ onComplete, onCancel }: ClientOnboardingWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic
        name: "",
        email: "",
        phone: "",
        // Step 2: Business
        niche: "",
        customNiche: "",
        website: "",
        monthlyBudget: "",
        // Step 3: Ads
        metaConnectionMethod: "ad_account" as "ad_account" | "partner",
        metaAdsId: "",
        metaBusinessId: "",
        googleAdsId: "",
        otherPlatforms: [] as { name: string, id: string }[],
        notes: ""
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    const steps = [
        { number: 1, title: "Dados Básicos", icon: User },
        { number: 2, title: "Negócio", icon: Target },
        { number: 3, title: "Contas de Anúncio", icon: DollarSign },
        { number: 4, title: "Revisão", icon: Rocket },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto p-1">
            {/* Stepper Header */}
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10" />
                {steps.map((s) => {
                    const isActive = step >= s.number;
                    const isCurrent = step === s.number;
                    return (
                        <div key={s.number} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                            <div
                                style={isActive ? { background: 'linear-gradient(90deg, #FF6600 0%, #E85D04 100%)' } : {}}
                                className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${isActive ? 'border-transparent text-white shadow-[0_0_15px_rgba(255,102,0,0.5)]' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}
                                ${isCurrent ? 'ring-2 ring-[#FF6600]/30 ring-offset-2 ring-offset-black scale-110' : ''}
                            `}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-zinc-600'}`}>
                                {s.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Card className="bg-zinc-900/50 border-white/10 p-6 min-h-[400px] flex flex-col justify-between backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">Quem é o novo cliente?</h3>
                                    <p className="text-zinc-400 text-sm">Preencha os dados de contato do responsável.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Nome da Empresa / Cliente</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input
                                                className="pl-9 bg-black/40 border-white/10"
                                                placeholder="Ex: Construtora Elite"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email Principal</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    className="pl-9 bg-black/40 border-white/10"
                                                    placeholder="contato@empresa.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>WhatsApp / Telefone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    className="pl-9 bg-black/40 border-white/10"
                                                    placeholder="(11) 99999-9999"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">Detalhes da Operação</h3>
                                    <p className="text-zinc-400 text-sm">Para configurar a inteligência da conta.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Nicho de Atuação</Label>
                                        <Select value={formData.niche} onValueChange={v => setFormData({ ...formData, niche: v })}>
                                            <SelectTrigger className="bg-black/40 border-white/10">
                                                <SelectValue placeholder="Selecione o nicho" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="ecommerce">E-commerce</SelectItem>
                                                <SelectItem value="infoproduto">Infoproduto / Lançamentos</SelectItem>
                                                <SelectItem value="local">Negócio Local</SelectItem>
                                                <SelectItem value="imobiliario">Imobiliário</SelectItem>
                                                <SelectItem value="saas">SaaS / Tech</SelectItem>
                                                <SelectItem value="outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {formData.niche === 'outro' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-2"
                                            >
                                                <Input
                                                    className="bg-black/40 border-white/10"
                                                    placeholder="Qual é o nicho específico?"
                                                    value={formData.customNiche}
                                                    onChange={e => setFormData({ ...formData, customNiche: e.target.value })}
                                                    autoFocus
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website / Landing Page</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input
                                                className="pl-9 bg-black/40 border-white/10"
                                                placeholder="https://..."
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Orçamento Mensal Estimado (Mídia)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input
                                                className="pl-9 bg-black/40 border-white/10"
                                                placeholder="Ex: 5000"
                                                type="number"
                                                value={formData.monthlyBudget}
                                                onChange={e => setFormData({ ...formData, monthlyBudget: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">Conexões de Mídia</h3>
                                    <p className="text-zinc-400 text-sm">Registre os IDs para organização e futuras automações.</p>
                                </div>
                                <div className="space-y-4">
                                    {/* Meta Ads */}
                                    <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded bg-[#0668E1] flex items-center justify-center text-white font-bold">f</div>
                                            <div>
                                                <h4 className="font-semibold text-blue-100">Meta Ads</h4>
                                                <p className="text-xs text-blue-400/80">Facebook & Instagram</p>
                                            </div>
                                        </div>

                                        {/* Connection Method Toggle */}
                                        <div className="flex gap-2 mb-3 bg-black/20 p-1 rounded-md">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-1 h-7 text-xs ${formData.metaConnectionMethod === 'ad_account' ? 'bg-blue-500/20 text-blue-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                onClick={() => setFormData({ ...formData, metaConnectionMethod: 'ad_account' })}
                                            >
                                                Conta de Anúncios
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-1 h-7 text-xs ${formData.metaConnectionMethod === 'partner' ? 'bg-blue-500/20 text-blue-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                onClick={() => setFormData({ ...formData, metaConnectionMethod: 'partner' })}
                                            >
                                                Parceiro (BM)
                                            </Button>
                                        </div>

                                        {formData.metaConnectionMethod === 'ad_account' ? (
                                            <Input
                                                className="bg-black/40 border-blue-500/30 focus-visible:ring-blue-500/50"
                                                placeholder="ID da Conta (Ex: act_123456789)"
                                                value={formData.metaAdsId}
                                                onChange={e => setFormData({ ...formData, metaAdsId: e.target.value })}
                                            />
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    className="bg-black/40 border-blue-500/30 focus-visible:ring-blue-500/50"
                                                    placeholder="Business ID do Cliente (Ex: 1234567890)"
                                                    value={formData.metaBusinessId}
                                                    onChange={e => setFormData({ ...formData, metaBusinessId: e.target.value })}
                                                />
                                                <p className="text-[10px] text-blue-400/60 pl-1">
                                                    * Enviaremos uma solicitação de parceria para este Business Manager.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Google Ads */}
                                    <div className="p-4 rounded-lg bg-red-600/10 border border-red-500/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-xl font-bold">
                                                <span className="text-[#4285F4]">G</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-red-100">Google Ads</h4>
                                                <p className="text-xs text-red-400/80">Search, Youtube & Display</p>
                                            </div>
                                        </div>
                                        <Input
                                            className="bg-black/40 border-red-500/30 focus-visible:ring-red-500/50"
                                            placeholder="ID do Cliente (Ex: 123-456-7890)"
                                            value={formData.googleAdsId}
                                            onChange={e => setFormData({ ...formData, googleAdsId: e.target.value })}
                                        />
                                    </div>

                                    {/* Other Platforms Expansion */}
                                    <div className="pt-2">
                                        <Label className="text-zinc-400 mb-2 block">Outras Plataformas (Opcional)</Label>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {['TikTok Ads', 'Pinterest Ads', 'LinkedIn Ads', 'Twitter Ads'].map(platform => (
                                                <Button
                                                    key={platform}
                                                    variant="outline"
                                                    className={`justify-start border-zinc-800 hover:bg-zinc-800 ${formData.otherPlatforms.some(p => p.name === platform) ? 'bg-zinc-800 border-zinc-700' : 'bg-transparent'}`}
                                                    onClick={() => {
                                                        const exists = formData.otherPlatforms.some(p => p.name === platform);
                                                        if (exists) {
                                                            setFormData({
                                                                ...formData,
                                                                otherPlatforms: formData.otherPlatforms.filter(p => p.name !== platform)
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                otherPlatforms: [...formData.otherPlatforms, { name: platform, id: '' }]
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {formData.otherPlatforms.some(p => p.name === platform) ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <div className="w-4 h-4 mr-2 rounded-full border border-zinc-600" />}
                                                    {platform}
                                                </Button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {formData.otherPlatforms.map((platform, index) => (
                                                <motion.div
                                                    key={platform.name}
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                                                        <div className="text-xs font-semibold text-zinc-400 w-24 shrink-0">{platform.name}</div>
                                                        <Input
                                                            className="bg-black/50 border-zinc-700 h-8 text-sm"
                                                            placeholder={`Cole o ID ou Link do ${platform.name}`}
                                                            value={platform.id}
                                                            onChange={(e) => {
                                                                const newPlatforms = [...formData.otherPlatforms];
                                                                newPlatforms[index].id = e.target.value;
                                                                setFormData({ ...formData, otherPlatforms: newPlatforms });
                                                            }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-white/5">
                                        <Label>Observações de Acesso</Label>
                                        <Textarea
                                            className="bg-black/40 border-white/10 min-h-[80px]"
                                            placeholder="Ex: Cliente prefere que solicite acesso via parceiro..."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 text-center pt-4">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Rocket className="w-10 h-10 text-emerald-500" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Tudo Pronto para a Decolagem!</h3>
                                    <p className="text-zinc-400 max-w-sm mx-auto">
                                        Ao confirmar, nosso sistema irá criar o perfil, configurar o CRM e enviar os acessos para
                                        <span className="text-white font-semibold"> {formData.email}</span>.
                                    </p>
                                </div>

                                <div className="bg-black/40 rounded-lg p-6 text-left border border-white/5 text-sm space-y-4 max-w-sm mx-auto">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-white/5 pb-1 mb-2">
                                            Dados Básicos <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setStep(1)}>(Editar)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Cliente:</span>
                                            <span className="text-zinc-200 font-medium">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Email:</span>
                                            <span className="text-zinc-200">{formData.email}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-white/5 pb-1 mb-2">
                                            Operação <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setStep(2)}>(Editar)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Nicho:</span>
                                            <span className="text-zinc-200 capitalize highlight-white/10 px-1 rounded">
                                                {formData.niche === 'outro' ? formData.customNiche : formData.niche || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Orçamento:</span>
                                            <span className="text-emerald-400 font-mono">R$ {formData.monthlyBudget || '0'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-white/5 pb-1 mb-2">
                                            Mídia <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setStep(3)}>(Editar)</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {(formData.metaAdsId || formData.metaBusinessId) && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-blue-400">Meta {formData.metaConnectionMethod === 'partner' ? '(BM)' : ''}:</span>
                                                    <span className="text-zinc-300 font-mono">{formData.metaConnectionMethod === 'partner' ? formData.metaBusinessId : formData.metaAdsId}</span>
                                                </div>
                                            )}
                                            {formData.googleAdsId && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-red-400">Google:</span>
                                                    <span className="text-zinc-300 font-mono">{formData.googleAdsId}</span>
                                                </div>
                                            )}
                                            {formData.otherPlatforms.map(p => (
                                                <div key={p.name} className="flex justify-between text-xs items-center">
                                                    <span className="text-zinc-400">{p.name.split(' ')[0]}:</span>
                                                    <span className="text-zinc-300 font-mono truncate max-w-[150px]">{p.id || 'Pendente'}</span>
                                                </div>
                                            ))}
                                            {!formData.metaAdsId && !formData.metaBusinessId && !formData.googleAdsId && formData.otherPlatforms.length === 0 && (
                                                <span className="text-zinc-600 italic">Nenhum ID informado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between pt-6 mt-6 border-t border-white/5">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={handleBack} className="text-zinc-400 hover:text-white">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={onCancel} className="text-zinc-400 hover:text-white">
                            Cancelar
                        </Button>
                    )}

                    {step < 4 ? (
                        <Button onClick={handleNext} className="bg-white text-black hover:bg-zinc-200 font-bold">
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-lg shadow-emerald-500/20">
                            <Rocket className="w-4 h-4 mr-2" />
                            Iniciar Onboarding Mágico
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
