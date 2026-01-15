
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, UserPlus, MoreVertical, Trash2, Mail } from "lucide-react";
import { agencyService } from "@/services/agencyService";
import { useAuth } from "@/contexts/AuthContext";

export default function AgencyUsers() {
    const { user } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ name: "", email: "", role: "agent" });

    useEffect(() => {
        if (user) loadTeam();
    }, [user]);

    const loadTeam = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await agencyService.getTeamMembers(user.id);
            setMembers(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar equipe.");
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!user) return;
        try {
            await agencyService.inviteMember(user.id, inviteData.email, inviteData.role, inviteData.name);
            toast.success("Convite enviado com sucesso!");
            setInviteOpen(false);
            setInviteData({ name: "", email: "", role: "agent" });
            // Mock update local state
            setMembers([...members, {
                id: crypto.randomUUID(),
                full_name: inviteData.name,
                email: inviteData.email,
                role: inviteData.role,
                created_at: new Date().toISOString()
            }]);
        } catch (error) {
            toast.error("Erro ao enviar convite.");
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="USUÁRIOS"
                    titleAccent="& TIME"
                    subtitle="GESTÃO DE EQUIPE E PERMISSÕES"
                />

                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo Membro
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Convidar Membro</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Envie um convite por e-mail para adicionar um novo usuário à sua agência.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input
                                    className="bg-black/50 border-white/10"
                                    placeholder="Ex: João Silva"
                                    value={inviteData.name}
                                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail Profissional</Label>
                                <Input
                                    className="bg-black/50 border-white/10"
                                    placeholder="joao@agencia.com"
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Função</Label>
                                <Select
                                    value={inviteData.role}
                                    onValueChange={(val) => setInviteData({ ...inviteData, role: val })}
                                >
                                    <SelectTrigger className="bg-black/50 border-white/10">
                                        <SelectValue placeholder="Selecione um cargo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="admin">Administrador (Total)</SelectItem>
                                        <SelectItem value="agent">Agente (Operacional)</SelectItem>
                                        <SelectItem value="viewer">Visualizador (Somente Leitura)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInviteOpen(false)} className="border-white/10 hover:bg-white/5 text-zinc-300">
                                Cancelar
                            </Button>
                            <Button onClick={handleInvite} className="bg-primary hover:bg-primary/90">
                                Enviar Convite
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-black/40 border-white/10">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-zinc-400">Nome</TableHead>
                                <TableHead className="text-zinc-400">Cargo</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400">Data de Entrada</TableHead>
                                <TableHead className="text-right text-zinc-400">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Carregando equipe...
                                    </TableCell>
                                </TableRow>
                            ) : members.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <UserPlus className="w-6 h-6 text-zinc-500" />
                                            </div>
                                            <p className="text-zinc-400 font-medium">Nenhum membro encontrado</p>
                                            <p className="text-zinc-600 text-sm max-w-xs">
                                                Comece convidando sua equipe para colaborar nos projetos da agência.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium text-white">
                                            <div className="flex flex-col">
                                                <span>{member.full_name || 'Sem nome'}</span>
                                                <span className="text-xs text-muted-foreground">{member.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="uppercase text-[10px] bg-white/5 border-white/10 text-white">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                                <span className="text-sm text-zinc-300">Ativo</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(member.created_at || Date.now()).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
