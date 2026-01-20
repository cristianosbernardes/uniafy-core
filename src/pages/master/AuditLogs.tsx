import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ShieldAlert,
    Search,
    Filter,
    Eye,
    Terminal,
    Clock
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/services/mockSaaS';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AuditAction } from '@/types/uniafy';

export default function AuditLogs() {
    const [searchTerm, setSearchTerm] = useState('');

    // Helper para cores das ações
    const getActionColor = (action: AuditAction) => {
        switch (action) {
            case 'LOGIN': return 'status-info';
            case 'CREATE': return 'status-success';
            case 'UPDATE': return 'status-warning';
            case 'DELETE': return 'status-error';
            case 'EXPORT': return 'status-info';
            case 'IMPERSONATE': return 'status-error';
            default: return 'status-info opacity-50';
        }
    };

    const filteredLogs = MOCK_AUDIT_LOGS.filter(log =>
        log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="LOGS DE"
                titleAccent="AUDITORIA"
                subtitle="Master Suite • Segurança e rastreabilidade"
                actions={[
                    {
                        label: 'Exportar Logs',
                        icon: ShieldAlert,
                        variant: 'outline',
                    },
                ]}
            />

            {/* Main Table */}
            <div className="glass-dynamic overflow-hidden rounded-[var(--radius)]">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="BUSCAR POR AÇÃO, USUÁRIO..."
                            className="pl-10 h-10 bg-black/40 border-white/10 text-xs font-bold uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-10 border-white/10 bg-white/5 gap-2 text-[10px] font-black uppercase">
                            <Clock className="w-4 h-4" /> Últimas 24h
                        </Button>
                        <Button variant="outline" className="h-10 border-white/10 bg-white/5 gap-2 text-[10px] font-black uppercase">
                            <Filter className="w-4 h-4" /> Filtros Avançados
                        </Button>
                    </div>
                </div>

                {/* List Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 text-[var(--fs-small)] font-black uppercase text-muted-foreground border-b border-white/5">
                    <div className="col-span-2">Data & Hora</div>
                    <div className="col-span-3">Ator (Quem fez)</div>
                    <div className="col-span-2 text-center">Ação</div>
                    <div className="col-span-4">Alvo & Detalhes</div>
                    <div className="col-span-1 text-right">Meta</div>
                </div>

                {/* List Body */}
                <div className="divide-y divide-white/5">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">

                            {/* Data */}
                            <div className="col-span-2 flex flex-col">
                                <span className="text-xs font-bold text-zinc-300">
                                    {format(new Date(log.created_at), "dd/MM/yyyy")}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {format(new Date(log.created_at), "HH:mm:ss")}
                                </span>
                            </div>

                            {/* Ator */}
                            <div className="col-span-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700">
                                    {log.actor_name.substring(0, 1)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase">{log.actor_name}</h4>
                                    <span className="text-[9px] text-muted-foreground">IP: {log.ip_address}</span>
                                </div>
                            </div>

                            {/* Ação */}
                            <div className="col-span-2 flex justify-center">
                                <Badge variant="outline" className={`text-[var(--fs-small)] font-black uppercase border h-7 px-3 flex items-center justify-center ${getActionColor(log.action)}`}>
                                    {log.action}
                                </Badge>
                            </div>

                            {/* Alvo */}
                            <div className="col-span-4 flex items-center gap-2">
                                <Terminal className="w-3 h-3 text-muted-foreground/50" />
                                <span className="text-xs font-medium text-zinc-300 truncate">{log.target}</span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10">
                                    <Eye className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
