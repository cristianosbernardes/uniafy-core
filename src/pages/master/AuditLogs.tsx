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
            case 'LOGIN': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'CREATE': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'UPDATE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'DELETE': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'EXPORT': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'IMPERSONATE': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    const filteredLogs = MOCK_AUDIT_LOGS.filter(log =>
        log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <PageHeader
                title="LOGS DE"
                titleAccent="AUDITORIA"
                subtitle="MASTER SUITE • SEGURANÇA E RASTREABILIDADE"
                actions={[
                    {
                        label: 'Exportar Logs',
                        icon: ShieldAlert,
                        variant: 'outline',
                    },
                ]}
            />

            {/* Main Table */}
            <div className="glass-card overflow-hidden">
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
                <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 text-[10px] font-black uppercase text-muted-foreground border-b border-white/5">
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
                                <Badge variant="outline" className={`text-[9px] font-black uppercase border h-6 px-3 ${getActionColor(log.action)}`}>
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
