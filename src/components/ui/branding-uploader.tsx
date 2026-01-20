import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from "sonner";

interface UiAssetUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    bucketName?: string;
}

export function UiAssetUploader({ label, value, onChange, bucketName = "Identidade Visual" }: UiAssetUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [tab, setTab] = useState<'upload' | 'url'>('upload');

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
                    }, 'image/webp', 0.85); // 85% quality for good balance
                };
                img.onerror = () => reject(new Error("Falha ao carregar imagem"));
                img.src = event.target?.result as string;
            };
            reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
            reader.readAsDataURL(file);
        });
    };

    const deleteOldFile = async (currentUrl: string) => {
        if (!currentUrl || !currentUrl.includes(bucketName)) return;

        try {
            // Extrair o nome do arquivo da URL (considerando espaços e caracteres especiais)
            const parts = currentUrl.split('/');
            const fileNameWithParams = parts[parts.length - 1];
            const fileName = decodeURIComponent(fileNameWithParams.split('?')[0]);

            const { error } = await supabase.storage
                .from(bucketName)
                .remove([fileName]);

            if (error) {
                console.warn("Aviso ao deletar arquivo antigo:", error.message);
            } else {
                console.log("Arquivo antigo deletado com sucesso:", fileName);
            }
        } catch (error) {
            console.error("Erro ao deletar arquivo antigo:", error);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const sourceFile = event.target.files[0];

            // 1. Converter para WebP (a menos que já seja um formato que não queremos mexer, mas o user pediu todos)
            const webpBlob = await convertToWebp(sourceFile);

            // 2. Definir nome do arquivo (sempre .webp agora)
            const fileName = `${Math.random().toString(36).substring(2)}.webp`;
            const filePath = `${fileName}`;

            // 3. Deletar imagem anterior se existir
            if (value) {
                await deleteOldFile(value);
            }

            // 4. Upload do novo arquivo WebP
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, webpBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
            toast.success("Imagem otimizada e enviada com sucesso!");
        } catch (error: any) {
            console.error('Erro no upload:', error);
            toast.error('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">{label}</Label>
                {value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange('')}
                        className="h-5 px-2 text-[10px] text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                        Remover
                    </Button>
                )}
            </div>

            <div className="border border-white/10 rounded-xl bg-black/20 p-4 space-y-4">
                {value ? (
                    <div className="relative group flex justify-center py-4 bg-[url('/transparent-pattern.png')] bg-repeat">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                            <ImageIcon className="w-8 h-8 text-white/50" />
                        </div>
                        <img
                            src={value}
                            alt="Asset Preview"
                            className="h-16 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                        />
                    </div>
                ) : (
                    <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-black/40 h-8 p-0.5 mb-3">
                            <TabsTrigger value="upload" className="text-[10px] uppercase data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 h-7 rounded-sm">
                                <Upload className="w-3 h-3 mr-2" /> Upload
                            </TabsTrigger>
                            <TabsTrigger value="url" className="text-[10px] uppercase data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 h-7 rounded-sm">
                                <LinkIcon className="w-3 h-3 mr-2" /> Link
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="mt-0">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                    ) : (
                                        <Upload className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors mb-2" />
                                    )}
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold group-hover:text-zinc-300">
                                        {uploading ? 'Enviando...' : 'Clique ou arraste'}
                                    </p>
                                    <p className="text-[9px] text-zinc-600">SVG, PNG, JPG (Max 2MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </TabsContent>

                        <TabsContent value="url" className="mt-0">
                            <div className="flex gap-2">
                                <Input
                                    className="h-9 bg-black/40 border-white/10 text-xs text-white placeholder:text-zinc-700"
                                    placeholder="https://exemplo.com/logo.png"
                                    onChange={(e) => {
                                        // Simple validation could go here
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value) onChange(e.target.value)
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-2 px-1">
                                Cole o link direto da imagem e clique fora para aplicar.
                            </p>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
