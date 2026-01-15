
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Search, ExternalLink, MoreVertical, Briefcase, Ghost, Mail } from "lucide-react";
import { agencyService } from "@/services/agencyService";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AgencyClients() {
    const { user } = useAuth();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [clientData, setClientData] = useState({ name: "", email: "", plan: "pro" });

    useEffect(() => {
        if (user) loadClients();
    }, [user]);

    const loadClients = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Mock data for clients if service returns empty (since we don't have real clients yet)
            const data = await agencyService.getClients(user.id);
            if (!data || data.length === 0) {
                // Temporary Mock for demonstration
                setClients([
                    { id: 1, full_name: "Loja de Móveis Silva", email: "contato@moveissilva.com.br", plan: "Enterprise", status: "active", ltv: "R$ 12.450" },
                    { id: 2, full_name: "Dra. Ana Paula Dermato", email: "financeiro@anapaula.com", plan: "Pro", status: "trial", ltv: "R$ 0" },
                    { id: 3, full_name: "Academia Fitness Plus", email: "gerencia@fitplus.com", plan: "Basic", status: "overdue", ltv: "R$ 3.200" },
                ]);
            } else {
                setClients(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar clientes.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async () => {
        if (!user) return;
        try {
            await agencyService.createClient(user.id, clientData);
            toast.success("Cliente cadastrado com sucesso!");
            setInviteOpen(false);

            // Mock update
            setClients([...clients, {
                id: crypto.randomUUID(),
                full_name: clientData.name,
                email: clientData.email,
                plan: clientData.plan === 'pro' ? 'Pro' : 'Enterprise',
                status: 'active',
                ltv: 'R$ 0'
            }]);

            setClientData({ name: "", email: "", plan: "pro" });
        } catch (error) {
            toast.error("Erro ao criar cliente.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'trial': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'overdue': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="CARTEIRA"
                    titleAccent="DE CLIENTES"
                    subtitle="CRM E INTEGRAÇÃO DE CONTAS"
                />

                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Adicionar Cliente</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Cadastre um novo cliente para gerenciar no seu painel.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome da Empresa / Cliente</Label>
                                <Input
                                    className="bg-black/50 border-white/10"
                                    placeholder="Ex: Empresa X"
                                    value={clientData.name}
                                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail do Responsável</Label>
                                <Input
                                    className="bg-black/50 border-white/10"
                                    placeholder="cliente@empresa.com"
                                    value={clientData.email}
                                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Plano Contratado</Label>
                                <Select
                                    value={clientData.plan}
                                    onValueChange={(val) => setClientData({ ...clientData, plan: val })}
                                >
                                    <SelectTrigger className="bg-black/50 border-white/10">
                                        <SelectValue placeholder="Selecione um plano" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="basic">Basic (Monitoramento)</SelectItem>
                                        <SelectItem value="pro">Pro (Gestão Completa)</SelectItem>
                                        <SelectItem value="enterprise">Enterprise (White Label)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInviteOpen(false)} className="border-white/10 hover:bg-white/5 text-zinc-300">
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateClient} className="bg-primary hover:bg-primary/90">
                                Cadastrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-lg border border-white/5">
                <Search className="w-5 h-5 text-zinc-500" />
                <Input
                    placeholder="Buscar clientes por nome, email ou ID..."
                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600"
                />
            </div>

            <Card className="bg-black/40 border-white/10">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-zinc-400">Cliente</TableHead>
                                <TableHead className="text-zinc-400">Plano</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400">LTV Estimado</TableHead>
                                <TableHead className="text-right text-zinc-400">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Carregando clientes...
                                    </TableCell>
                                </TableRow>
                            ) : clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Briefcase className="w-6 h-6 text-zinc-500" />
                                            </div>
                                            <p className="text-zinc-400 font-medium">Nenhum cliente na carteira</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium text-white">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base">{client.full_name || 'Sem nome'}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {client.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                                                {client.plan || 'Basic'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(client.status)}>
                                                {client.status === 'active' && 'Ativo'}
                                                {client.status === 'trial' && 'Em Teste'}
                                                {client.status === 'overdue' && 'Inadimplente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-300 font-mono">
                                            {client.ltv || 'R$ 0,00'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-zinc-200">
                                                    <DropdownMenuLabel>Ações do Cliente</DropdownMenuLabel>
                                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Ver Dashboard
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem className="focus:bg-red-900/50 text-red-400 cursor-pointer">
                                                        Excluir Cliente
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
