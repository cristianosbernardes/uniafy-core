
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 text-white">
            <Card className="w-full max-w-md bg-[#111] border-white/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        O cadastro de novas agências é feito via convite ou checkout.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center text-sm text-zinc-500">
                        <p>Se você já tem um convite, use o link enviado por e-mail.</p>
                        <p className="mt-2">Ou vá para a página de Planos para assinar.</p>
                    </div>
                    <Button asChild className="w-full font-bold">
                        <Link to="/login">Voltar para Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
