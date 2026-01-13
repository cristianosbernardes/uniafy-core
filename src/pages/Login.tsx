import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-primary flex items-center justify-center rounded-xl rotate-45">
                            <Shield className="w-8 h-8 text-black -rotate-45" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold uppercase text-white">UNIAFY CORE</h1>
                    <p className="text-muted-foreground text-xs uppercase opacity-70">V5.9.6 PRECISION INDUSTRIAL</p>
                </div>

                <div className="card-industrial p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Assinatura de Acesso</label>
                            <Input
                                type="email"
                                placeholder="CEO@UNIAFY.APP"
                                className="bg-black/50 border-white/5 focus:border-primary/50 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Chave de Segurança</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="bg-black/50 border-white/5 focus:border-primary/50 text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold uppercase h-12 gap-2 group">
                        Autenticar Protocolo
                        <Lock className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">
                        Ambiente Seguro • Encriptação de Nível Militar
                    </p>
                </div>
            </div>
        </div>
    );
}
