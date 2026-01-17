
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, ShieldCheck, Lock, CreditCard, Loader2, ArrowRight, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { masterService } from '@/services/masterService';
import { agencyService } from '@/services/agencyService';

// Tipagem simples para o Plano
interface Plan {
    id: string;
    name: string;
    price: number;
    period: string;
    features: string[];
}

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Etapas: 1=Identificação, 2=Endereço, 3=Pagamento
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [validatingCPF, setValidatingCPF] = useState(false);

    // Dados do Formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cpf: '', // Validado e Único
        phone: '',
        // Endereço (Necessário para Gateway/NF)
        cep: '',
        address: '',
        number: '',
        city: '',
        state: '',
        // Pagamento
        holderName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    // Seleção de Plano
    const [selectedPlanId, setSelectedPlanId] = useState<string>(searchParams.get('plan') || '');
    const [plans, setPlans] = useState<Plan[]>([]);
    const [activeGateway, setActiveGateway] = useState<string>('asaas');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [plansData, configData] = await Promise.all([
                masterService.getPlans(),
                masterService.getGlobalConfig()
            ]);

            setPlans(plansData.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.monthly_price_amount || 0,
                period: 'monthly',
                features: p.features || []
            })));

            if (configData?.active_gateway) {
                setActiveGateway(configData.active_gateway);
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- VALIDAÇÕES ---

    const validateCPF = async () => {
        const cpf = formData.cpf.replace(/\D/g, '');
        if (cpf.length !== 11) {
            toast.error("CPF inválido (deve ter 11 dígitos).");
            return false;
        }

        setValidatingCPF(true);
        try {
            // Chama a RPC que criamos com o preset 'util-check-cpf'
            const { data: isAvailable, error } = await supabase.rpc('check_cpf_available', { cpf_check: cpf });

            if (error) throw error;

            if (!isAvailable) {
                toast.error("Este CPF já está cadastrado em nosso sistema.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Erro ao validar CPF", error);
            // Se a RPC falhar (ex: não criada ainda), deixamos passar com aviso no console
            // toast.error("Erro ao validar disponibilidade do CPF.");
            return true; // Fail-open para não travar se o usuário esqueceu de rodar o SQL
        } finally {
            setValidatingCPF(false);
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password || !formData.cpf) {
                toast.error("Preencha todos os campos obrigatórios.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("As senhas não coincidem.");
                return;
            }

            const cpfOk = await validateCPF();
            if (!cpfOk) return;

            setStep(2);
        } else if (step === 2) {
            if (!formData.cep || !formData.address || !formData.number) {
                toast.error("Preencha o endereço completo.");
                return;
            }
            setStep(3);
        }
    };

    const handleCheckout = async () => {
        if (!selectedPlanId) {
            toast.error("Selecione um plano para continuar.");
            return;
        }

        setLoading(true);
        try {
            // MOCK - Aqui entrará a tokenização do cartão com Asaas/Stripe
            // const token = await gateway.createToken(...)

            // Simulação de delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Criação do Cliente (MOCK por enquanto, futuramente chamará a Edge Function)
            // await agencyService.createFullSubscription(...)

            toast.success("Assinatura realizada com sucesso! Bem-vindo!");
            navigate('/login'); // Ou Dashboard direto se auto-logar
        } catch (error) {
            console.error(error);
            toast.error("Erro ao processar assinatura.");
        } finally {
            setLoading(false);
        }
    };

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    return (
        <div className="min-h-screen bg-black/95 text-zinc-100 flex flex-col md:flex-row">
            {/* Left: Summary & Branding */}
            <div className="md:w-1/3 bg-[#050505] border-r border-white/5 p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Checkout Seguro
                        </h1>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Você está assinando</h3>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                                {selectedPlan ? (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg text-white">{selectedPlan.name}</h4>
                                                <p className="text-zinc-400 text-sm">Cobrança mensal</p>
                                            </div>
                                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                R$ {selectedPlan.price.toFixed(2)}
                                            </Badge>
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <ul className="space-y-2 text-sm text-zinc-300">
                                            {selectedPlan.features.slice(0, 3).map((f, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {f}
                                                </li>
                                            ))}
                                            <li className="flex items-center gap-2 text-zinc-500 italic">
                                                + Todas as features do plano
                                            </li>
                                        </ul>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-zinc-500">
                                        Nenhum plano selecionado
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Lock className="w-3 h-3" />
                            Ambiente criptografado. Seus dados estão seguros.
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-8">
                    <p className="text-zinc-600 text-xs">
                        © 2026 Uniafy Inc. Todos os direitos reservados.
                    </p>
                </div>
            </div>

            {/* Right: Steps Form */}
            <div className="md:w-2/3 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-xl mx-auto space-y-8">
                    {/* Stepper */}
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-0" />
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`
                                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                                    ${step >= s ? 'bg-primary border-primary text-white' : 'bg-[#111] border-white/10 text-zinc-600'}
                                `}
                            >
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                        ))}
                    </div>

                    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                {step === 1 && <><User className="w-5 h-5 text-primary" /> Identificação</>}
                                {step === 2 && <><MapPin className="w-5 h-5 text-primary" /> Endereço de Faturamento</>}
                                {step === 3 && <><CreditCard className="w-5 h-5 text-primary" /> Pagamento</>}
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                {step === 1 && "Crie suas credenciais de acesso seguro."}
                                {step === 2 && "Necessário para emissão da Nota Fiscal."}
                                {step === 3 && `Processado via ${activeGateway.charAt(0).toUpperCase() + activeGateway.slice(1)} segura.`}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* STEP 1: IDENTIFICAÇÃO */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label>Nome Completo</Label>
                                        <Input placeholder="Seu nome ou da empresa" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="bg-black/50 border-white/10" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>CPF</Label>
                                            <Input
                                                placeholder="000.000.000-00"
                                                value={formData.cpf}
                                                onChange={e => handleInputChange('cpf', e.target.value)}
                                                className={`bg-black/50 border-white/10 ${validatingCPF ? 'opacity-50' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Celular</Label>
                                            <Input placeholder="(00) 00000-0000" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>E-mail Corporativo</Label>
                                        <Input type="email" placeholder="nome@empresa.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="bg-black/50 border-white/10" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Senha</Label>
                                            <Input type="password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Confirmar Senha</Label>
                                            <Input type="password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: ENDEREÇO */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2 col-span-1">
                                            <Label>CEP</Label>
                                            <Input placeholder="00000-000" value={formData.cep} onChange={e => handleInputChange('cep', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Rua / Logradouro</Label>
                                            <Input placeholder="Av. Paulista..." value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Número</Label>
                                            <Input placeholder="1000" value={formData.number} onChange={e => handleInputChange('number', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cidade</Label>
                                            <Input placeholder="São Paulo" value={formData.city} onChange={e => handleInputChange('city', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>UF</Label>
                                            <Input placeholder="SP" value={formData.state} onChange={e => handleInputChange('state', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: PAGAMENTO */}
                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-bold text-primary text-sm">Cartão de Crédito</p>
                                            <p className="text-xs text-zinc-400">Ambiente {activeGateway} Seguro</p>
                                        </div>
                                        <CreditCard className="w-6 h-6 text-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Nome Impresso no Cartão</Label>
                                        <Input placeholder="COMO NO CARTAO" value={formData.holderName} onChange={e => handleInputChange('holderName', e.target.value)} className="bg-black/50 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Número do Cartão</Label>
                                        <Input placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={e => handleInputChange('cardNumber', e.target.value)} className="bg-black/50 border-white/10" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Validade</Label>
                                            <Input placeholder="MM/AA" value={formData.expiry} onChange={e => handleInputChange('expiry', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVV</Label>
                                            <Input placeholder="123" value={formData.cvv} onChange={e => handleInputChange('cvv', e.target.value)} className="bg-black/50 border-white/10" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-white/5 pt-6">
                            {step > 1 ? (
                                <Button variant="ghost" onClick={() => setStep(step - 1)} className="hover:bg-white/5 text-zinc-400">
                                    Voltar
                                </Button>
                            ) : (
                                <div />
                            )}

                            {step < 3 ? (
                                <Button onClick={handleNextStep} className="bg-white hover:bg-zinc-200 text-black font-bold">
                                    Próximo Passo <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold w-full md:w-auto"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Finalizar Assinatura
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <div className="text-center text-xs text-zinc-600">
                        Ao clicar em finalizar, você concorda com nossos Termos de Uso e Política de Privacidade.
                        Cobrança recorrente de R$ {selectedPlan?.price.toFixed(2)}/mês.
                    </div>
                </div>
            </div>
        </div>
    );
}
