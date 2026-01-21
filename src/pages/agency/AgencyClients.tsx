
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
import { ClientOnboardingWizard } from "@/components/agency/ClientOnboardingWizard";
import { useTraffic } from "@/contexts/TrafficContext";
import { useNavigate } from "react-router-dom";

export default function AgencyClients() {
    const { user } = useAuth();
    const { selectClient, clients, isLoading: loading, refreshClients } = useTraffic();
    const navigate = useNavigate();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [clientData, setClientData] = useState<any>({});

    /* 
    const loadClients = async () => { ... } 
    Removed to use unified TrafficContext source
    */

    const handleViewDashboard = (clientId: string) => {
        // 1. Select the client globally
        selectClient(clientId.toString());
        // 2. Navigate to the Traffic Reports (Builder) page
        navigate('/traffic/reports');
        // 3. Optional: Toast
        toast.info("Acessando painel do cliente...");
    };

    // Unified data source via TrafficContext
    // useEffect(() => { if (user) loadClients(); }, [user]);

    const handleCreateClient = async (data: any) => {
        if (!user) return;
        try {
            await agencyService.createClient(user.id, data);
            toast.success("Onboarding iniciado com sucesso! O acesso será enviado em breve.");
            setInviteOpen(false);

            // Mock update: refresh clients from context (which will likely just reload mocks for now)
            await refreshClients();

            // Trigger confetti or success animation here if possible
        } catch (error) {
            toast.error("Erro ao iniciar onboarding.");
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="CARTEIRA"
                    titleAccent="DE CLIENTES"
                    subtitle="CRM e integração de contas"
                />

                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-transparent border-none shadow-none max-w-4xl max-h-[90vh] p-0 overflow-y-auto custom-scrollbar">
                        <ClientOnboardingWizard
                            onComplete={handleCreateClient}
                            onCancel={() => setInviteOpen(false)}
                        />
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
                                                    <DropdownMenuItem
                                                        className="focus:bg-white/10 cursor-pointer"
                                                        onClick={() => handleViewDashboard(client.id)}
                                                    >
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
