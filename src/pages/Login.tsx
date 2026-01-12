import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
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
            navigate('/operacional/dashboard');
        } catch (error: any) {
            toast.error('Erro ao realizar login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[420px] z-10"
            >
                <div className="bg-background-secondary/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                            <Crown className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2 uppercase">
                            Uniafy <span className="text-primary">Core</span>
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Sistema de Gestão Industrial para Agências
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold ml-1">
                                E-mail Institucional
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="ex: voce@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-black/40 border-white/10 focus:border-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                                    Senha de Acesso
                                </label>
                                <button type="button" className="text-[10px] text-primary hover:underline">
                                    Esqueci a senha
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-black/40 border-white/10 focus:border-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider transition-all duration-300 group mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Entrar no Sistema
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        Infraestrutura de Segurança Uniafy Ativa
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                    Powered by Uniafy v5.9.6 Precision
                </p>
            </motion.div>
        </div>
    );
}
