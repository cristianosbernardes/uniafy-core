import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Trash2, HardDrive, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export default function SystemCache() {
    const [storageUsage, setStorageUsage] = useState<{ used: number, total: number, percent: number }>({ used: 0, total: 5, percent: 0 });
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        calculateStorage();
    }, []);

    const calculateStorage = () => {
        let total = 0;
        let count = 0;
        for (const x in localStorage) {
            // eslint-disable-next-line no-prototype-builtins
            if (!localStorage.hasOwnProperty(x)) continue;
            count++;
            total += (localStorage[x].length + x.length) * 2;
        }

        // Convert to KB
        const usedKB = total / 1024;
        const totalMB = 5; // Typical browser limit is 5-10MB
        const usedMB = usedKB / 1024;
        const percent = (usedMB / totalMB) * 100;

        setStorageUsage({
            used: parseFloat(usedKB.toFixed(2)),
            total: totalMB * 1024, // in KB
            percent: Math.min(percent, 100)
        });
        setItemCount(count);
    };

    const handleClearCache = () => {
        // Clear everything EXCEPT critical auth tokens if needed, but "Limpar Cache" usually implies full reset.
        // For safety, let's keep the theme preference or critical operational flags if we knew them.
        // But the user requested "Limpar Cache" similar to the example which likely wipes user data.

        // We will clear localStorage but warn the user.
        localStorage.clear();
        sessionStorage.clear();

        calculateStorage();
        toast.success("Cache do sistema limpo com sucesso!");

        // Optional: Reload to reset states
        setTimeout(() => window.location.reload(), 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="SISTEMA"
                titleAccent="ARMAZENAMENTO"
                subtitle="Gerencie o cache local e dados temporários do navegador"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Storage Status Card */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Database className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Armazenamento Local</CardTitle>
                                <CardDescription>Dados salvos neste dispositivo</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-3xl font-bold text-white">{itemCount}</span>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Itens Salvos</p>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-3xl font-bold text-white">{storageUsage.used} KB</span>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Utilizados</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Uso da Cota (~5MB)</span>
                                <span>{storageUsage.percent.toFixed(1)}%</span>
                            </div>
                            <Progress value={storageUsage.percent} className="h-2 bg-zinc-800" />
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                            <h4 className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-2">
                                <HardDrive className="w-4 h-4" />
                                Como funciona o cache?
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                O Uniafy armazena configurações locais, rascunhos de campanhas e preferências de visualização no seu navegador para tornar o carregamento mais rápido.
                                Limpar o cache pode resolver problemas de interface ou dados desatualizados, mas você precisará refazer algumas configurações pessoais.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Card */}
                <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col justify-between">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Zona de Limpeza</CardTitle>
                                <CardDescription>Ações destrutivas de manutenção</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 mb-6">
                            <h4 className="flex items-center gap-2 text-sm font-medium text-amber-500 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                Atenção
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Ao limpar o cache, sua sessão será encerrada e você precisará fazer login novamente. Dados na nuvem (Cloud) NÃO serão afetados.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full h-12 text-sm uppercase tracking-wide bg-red-600 hover:bg-red-700">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Limpar Cache de Sistema
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Isso irá limpar todo o LocalStorage e SessionStorage do seu navegador para este domínio. Suas preferências locais serão perdidas e você será desconectado.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClearCache} className="bg-red-600 hover:bg-red-700 text-white">
                                        Sim, limpar tudo
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
