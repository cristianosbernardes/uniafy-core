import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBranding } from '@/contexts/BrandingContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getLoginStyles, branding } = useBranding();

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

    const layout = branding?.login?.layout || 'center';

    if (layout === 'split') {
        return (
            <div className="min-h-screen w-full bg-[#0a0a0a] grid grid-cols-1 lg:grid-cols-2 font-sans text-slate-100">
                {/* LEFT: IMAGE & BRANDING */}
                <div className="relative hidden lg:block h-full overflow-hidden" style={getLoginStyles()}>
                    {/* Branding Overlay */}
                    {/* Branding Overlay (Visual: Only for image) */}
                    {branding?.login?.bg_type === 'image' && branding?.login?.overlay_color && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundColor: branding.login.overlay_color, // Hex/RGB
                                opacity: branding.login.overlay_opacity ?? 0.8
                            }}
                        />
                    )}
                    {/* Background Ambience */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px]" />
                        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-orange-900/10 rounded-full blur-[120px]" />
                    </div>

                    {/* Logo/Content on Image Side (Optional) */}
                    <div className="absolute bottom-12 left-12 z-10 p-8 max-w-lg">
                        <div className="z-10 mb-6">
                            {branding?.login?.logo_url ? (
                                <img src={branding.login.logo_url} alt="Logo" className="h-10 object-contain" />
                            ) : (
                                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <span className="font-bold text-xl text-white">U</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
                            {branding?.login?.title || "Bem-vindo de volta"}
                        </h2>
                        <p className="text-lg text-slate-200/80 leading-relaxed">
                            {branding?.login?.message || "Acesse sua conta para gerenciar campanhas e escalar seus resultados."}
                        </p>
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-16 relative">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[400px] z-10 space-y-8"
                    >
                        {/* Header Mobile Only or Minimal (since text is on left for desktop) */}
                        <div className="lg:hidden text-center space-y-2 mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {branding?.login?.title || "Bem-vindo"}
                            </h1>
                        </div>

                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Acessar Plataforma
                            </h2>
                            <p className="text-slate-400 text-sm">
                                Entre com suas credenciais abaixo.
                            </p>
                        </div>

                        {/* Card style in Split can be cleaner/flat or kept card */}
                        <div className="bg-[#111111]/50 border border-white/5 rounded-2xl p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:p-0">
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
                        <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
                            <p className="text-xs text-slate-600">
                                &copy; 2026 Uniafy Inc. Todos os direitos reservados.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }



    // Default: Center Layout
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative font-sans text-slate-100" style={getLoginStyles()}>

            {/* Branding Overlay */}
            {/* Branding Overlay (Visual: Only for image) */}
            {branding?.login?.bg_type === 'image' && branding?.login?.overlay_color && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundColor: branding.login.overlay_color, // Hex/RGB
                        opacity: branding.login.overlay_opacity ?? 0.8
                    }}
                />
            )}

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
                        {branding?.login?.logo_url ? (
                            <img src={branding.login.logo_url} alt="Logo" className="h-10 object-contain" />
                        ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="font-bold text-xl text-white">U</span>
                            </div>
                        )}
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
