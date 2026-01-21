import { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Sun, Moon, Lock, User, Building2, Mail, Eye, EyeOff, Upload, Loader2, Image as ImageIcon, Monitor } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/uniafy';
import { toast } from 'sonner';

export default function UserProfilePage() {
    const { user } = useAuth();
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Upload States
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Perfil Info
    const [agencyName, setAgencyName] = useState('Carregando...');

    // Convert Image to WebP
    const convertToWebp = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Não foi possível obter o contexto do canvas"));
                        return;
                    }
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Falha na conversão para WebP"));
                    }, 'image/webp', 0.85);
                };
                img.onerror = () => reject(new Error("Falha ao carregar imagem"));
                img.src = event.target?.result as string;
            };
            reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
            reader.readAsDataURL(file);
        });
    };

    // Handle Password Update
    const handleUpdatePassword = async () => {
        if (!password) {
            toast.error('Informe a nova senha');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            toast.success('Senha atualizada com sucesso!');
            setPassword('');
        } catch (error: any) {
            toast.error('Erro ao atualizar senha: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Avatar Upload
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0 || !user) return;

            setUploading(true);
            const sourceFile = event.target.files[0];

            // 1. Converter para WebP
            const webpBlob = await convertToWebp(sourceFile);

            const userFolder = `${user.id}`;
            const STORAGE_BUCKET = 'Imagem Perfil Usuarios';

            // 2. Limpar imagens antigas (Para não acumular lixo)
            const { data: existingFiles } = await supabase.storage
                .from(STORAGE_BUCKET)
                .list(userFolder);

            if (existingFiles && existingFiles.length > 0) {
                const filesToRemove = existingFiles.map(f => `${userFolder}/${f.name}`);
                await supabase.storage
                    .from(STORAGE_BUCKET)
                    .remove(filesToRemove);
            }

            // 3. Upload com nome fixo (avatar.webp)
            // Usamos nome fixo para garantir consistência, o cache será gerenciado pela URL
            const fileName = `${userFolder}/avatar.webp`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(fileName, webpBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 4. Obter URL Pública com Timestamp (Cache Busting)
            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(fileName);

            const publicUrlWithCache = `${publicUrl}?v=${Date.now()}`;

            // 5. Atualizar perfil do usuário
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrlWithCache }
            });

            if (updateError) throw updateError;

            toast.success("Foto de perfil atualizada!");

            // Força recarregar a página ou apenas deixa o estado reativo atualizar se o AuthContext escutar
            // O AuthContext escuta 'onAuthStateChange' (USER_UPDATED), então deve refletir.

        } catch (error: any) {
            console.error('Erro no upload:', error);
            toast.error('Falha ao atualizar foto: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Fetch Extra Details (Agency Name)
    useEffect(() => {
        async function loadProfile() {
            if (!user) return;

            // Default fallback
            let name = "Uniafy Corporation";

            try {
                // Tenta buscar da tabela profiles se existir
                const { data } = await supabase.from('profiles').select('agency_name, company_name').eq('id', user.id).maybeSingle();
                if (data) {
                    name = data.agency_name || data.company_name || name;
                } else if (user.role === UserRole.MASTER) {
                    name = "Uniafy Master Suite";
                }
            } catch (e) {
                console.error("Erro ao carregar perfil", e);
            }

            setAgencyName(name);
        }

        loadProfile();
    }, [user]);

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="MEU"
                titleAccent="PERFIL"
                subtitle="Gerencie suas credenciais e preferências de acesso"
                badge={user.role?.toUpperCase()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="card-industrial p-0 overflow-hidden group">
                    <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>

                    <div className="px-8 pb-8 -mt-16 flex flex-col items-center relative">
                        <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-zinc-950 border-4 border-zinc-900 shadow-2xl relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {uploading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/80 absolute inset-0 z-20">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <Camera className="w-8 h-8 text-white/80" />
                                    </div>
                                )}

                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-4xl font-bold text-zinc-600">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />

                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40 pointer-events-none">
                                <User className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="text-center space-y-1 mb-6">
                            <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-medium">
                                <Building2 className="w-3 h-3 text-primary" />
                                {agencyName}
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Email Corporativo</p>
                                    <p className="text-sm text-zinc-200 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Função / Cargo</p>
                                    <p className="text-sm text-zinc-200 font-medium capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Card */}
                <div className="space-y-6">
                    {/* Security */}
                    <div className="card-industrial p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-border-industrial">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Segurança da Conta</h3>
                                <p className="text-xs text-muted-foreground">Atualize sua senha de acesso ao portal</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Nova Senha</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite sua nova senha..."
                                        className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleUpdatePassword}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                {loading ? 'Atualizando...' : 'Atualizar Senha'}
                            </Button>
                        </div>
                    </div>

                    {/* Interface Parameters */}
                    <div className="card-industrial p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Preferências</h3>
                                <p className="text-xs text-muted-foreground">Customização de tema e interface</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'light', label: 'Clean White', icon: Sun },
                                { id: 'dark', label: 'Dark Industrial', icon: Moon },
                            ].map((mode) => {
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setThemeMode(mode.id as 'light' | 'dark')}
                                        className={cn(
                                            "p-3 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2",
                                            themeMode === mode.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border-industrial bg-zinc-950/30 hover:border-white/10"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", themeMode === mode.id ? "text-white" : "text-zinc-500")} />
                                        <span className={cn("text-[10px] uppercase tracking-wider font-bold", themeMode === mode.id ? "text-white" : "text-zinc-600")}>
                                            {mode.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
