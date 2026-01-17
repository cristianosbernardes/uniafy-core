import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
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
                toast.error('Credenciais inválidas. Verifique seus dados.');
                return;
            }

            toast.success('Login realizado com sucesso!');
            navigate('/');
        } catch (error: any) {
            toast.error('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative font-sans text-slate-100">

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-orange-900/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] z-10 space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <span className="font-bold text-xl text-white">U</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Bem-vindo de volta
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Acesse sua conta para continuar gerenciando suas campanhas.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <Input
                                type="email"
                                placeholder="nome@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-[#0a0a0a] border-white/10 rounded-lg focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 text-slate-200 placeholder:text-slate-600 transition-all font-sans"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Senha</label>
                                <a href="#" className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-[#0a0a0a] border-white/10 rounded-lg focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 text-slate-200 placeholder:text-slate-600 transition-all font-sans"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-orange-900/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Entrar
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Social Proof / Footer */}
                <div className="flex flex-col items-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <span>Plataforma Segura & Otimizada por IA</span>
                    </div>
                    <p className="text-xs text-slate-600">
                        &copy; 2026 Uniafy Inc. Todos os direitos reservados.
                    </p>
                </div>

            </motion.div>
        </div>
    );
}
