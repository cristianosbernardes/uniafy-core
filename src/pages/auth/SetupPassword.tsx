
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SetupPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSave = async () => {
        if (password !== confirm) {
            toast.error("As senhas não coincidem");
            return;
        }
        setLoading(true);
        // Mock save
        setTimeout(() => {
            setLoading(false);
            toast.success("Senha definida com sucesso!");
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 text-white">
            <Card className="w-full max-w-md bg-[#111] border-white/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Definir Senha</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Crie uma senha segura para acessar sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nova Senha</Label>
                        <Input
                            type="password"
                            className="bg-black/50 border-white/10"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirmar Senha</Label>
                        <Input
                            type="password"
                            className="bg-black/50 border-white/10"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !password}
                        className="w-full font-bold"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Salvar e Entrar
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
