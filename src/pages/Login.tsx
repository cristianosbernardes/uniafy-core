import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, ShieldCheck, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message === 'Invalid login credentials') {
                    toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
                } else {
                    toast.error(error.message);
                }
                return;
            }

            toast.success('Acesso autorizado. Bem-vindo ao Uniafy!');
            navigate('/');
        } catch (error: any) {
            toast.error('Erro ao realizar login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-700" />

            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-primary flex items-center justify-center rounded-2xl rotate-45 border border-primary/20 shadow-[0_0_30px_rgba(255,85,0,0.2)]">
                            <Shield className="w-8 h-8 text-black -rotate-45" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                            UNIAFY <span className="text-primary">CORE</span>
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                            V5.9.6 PRECISION INDUSTRIAL
                        </p>
                    </div>
                </div>

                <div className="glass-card p-10 space-y-8 relative border-white/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">
                                Assinatura de Acesso (E-mail)
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                <Input
                                    type="email"
                                    placeholder="CEO@UNIAFY.APP"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 pl-12 bg-black/40 border-white/10 focus:border-primary/50 text-white font-bold transition-all uppercase"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                    Chave de Segurança (Senha)
                                </label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 pl-12 bg-black/40 border-white/10 focus:border-primary/50 text-white font-bold transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm tracking-widest transition-all duration-300 group shadow-xl shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Autenticar Protocolo
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest pt-4 border-t border-white/5">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        Ambiente Seguro • Encriptação Militar
                    </div>
                </div>

                <p className="mt-8 text-center text-[9px] text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
                    SISTEMA OPERACIONAL UNIAFY v5.9.6
                </p>
            </motion.div>
        </div>
    );
}
