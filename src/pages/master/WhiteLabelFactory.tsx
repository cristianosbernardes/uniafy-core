import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Globe,
    Plus,
    CheckCircle2,
    Loader2,
    Copy,
    RefreshCw,
    Palette,
    Building2
} from 'lucide-react';
import { masterService } from '@/services/masterService';
import { CustomDomain } from '@/types/uniafy';
import { toast } from 'sonner';

export default function WhiteLabelFactory() {
    const [domains, setDomains] = useState<CustomDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [agencyName, setAgencyName] = useState('');
    const [newDomain, setNewDomain] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#F97316'); // Default Uniafy Orange
    const [logoUrl, setLogoUrl] = useState('');

    const [step, setStep] = useState<'details' | 'dns'>('details');
    const [verifying, setVerifying] = useState(false);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const data = await masterService.getWhiteLabelTenants();
            setDomains(data);
        } catch (error) {
            console.error("Failed to fetch tenants", error);
            toast.error("Erro ao carregar lista de agências");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const generateTenantId = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const handleGenerateConfig = () => {
        if (!agencyName || !newDomain) return;
        setStep('dns');
    };

    const handleFinalize = () => {
        const newTenant: CustomDomain = {
            id: `dom_${Date.now()}`,
            domain: newDomain,
            tenant_id: generateTenantId(agencyName),
            status: 'pending_dns',
            dns_record_type: 'CNAME',
            dns_record_value: 'cname.uniafy.com',
            created_at: new Date().toISOString(),
            branding: {
                primary_color: primaryColor,
                logo_url: logoUrl || undefined
            }
        };

        setDomains([newTenant, ...domains]);
        setIsDialogOpen(false);
        setStep('details');

        // Reset form
        setAgencyName('');
        setNewDomain('');
        setPrimaryColor('#F97316');
        setLogoUrl('');
    };

    const handleVerifyStats = (id: string) => {
        setVerifying(true);
        setTimeout(() => {
            setDomains(prev => prev.map(d =>
                d.id === id ? { ...d, status: 'active' } : d
            ));
            setVerifying(false);
        }, 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 text-[10px] font-black uppercase">Ativo & Seguro</Badge>;
            case 'pending_dns':
                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20 text-[10px] font-black uppercase">Aguardando DNS</Badge>;
            case 'ssl_error':
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 text-[10px] font-black uppercase">Erro SSL</Badge>;
            default:
                return <Badge variant="outline">Desconhecido</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="FÁBRICA"
                titleAccent="WHITE LABEL"
                subtitle="Master Suite • Domínios e branding multi-tenant"
                actions={[
                    {
                        label: 'Nova Agência / Domínio',
                        icon: Plus,
                        variant: 'primary',
                        onClick: () => {
                            setStep('details');
                            setAgencyName('');
                            setNewDomain('');
                            setIsDialogOpen(true);
                        }
                    }
                ]}
            />



            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Domínios e Tenants Conectados
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded">
                            {domains.length} tenants
                        </span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {domains.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                Nenhuma agência encontrada.
                            </div>
                        )}
                        {domains.map(domain => (
                            <div key={domain.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-105"
                                        style={{ backgroundColor: domain.branding?.primary_color || '#000' }}
                                    >
                                        {domain.branding?.logo_url ? (
                                            <img src={domain.branding.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-white/50" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{domain.tenant_id}</h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Globe className="w-3 h-3" />
                                            <span className="font-mono text-zinc-300">{domain.domain}</span>
                                            <span className="text-zinc-700">•</span>
                                            <span className="text-[10px]">Criado em {new Date(domain.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-1">
                                        {getStatusBadge(domain.status)}
                                        {domain.status === 'pending_dns' && (
                                            <button
                                                className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 font-bold uppercase transition-colors"
                                                onClick={() => handleVerifyStats(domain.id)}
                                                disabled={verifying}
                                            >
                                                {verifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                                Verificar DNS
                                            </button>
                                        )}
                                    </div>

                                    <Button variant="outline" size="sm" className="h-8 border-white/10 text-xs font-bold uppercase gap-2">
                                        <Palette className="w-3 h-3" />
                                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: domain.branding?.primary_color || '#fff' }} />
                                        Configurar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dialog de Novo Tenant */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase">
                            {step === 'details' ? 'Cadastrar Nova Agência' : 'Configuração de DNS'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {step === 'details'
                                ? 'Defina a identidade visual e o domínio da agência.'
                                : 'Aponte o domínio para nossos servidores.'}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 'details' ? (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Nome da Agência</Label>
                                    <Input
                                        placeholder="Ex: Rocket Ads"
                                        className="bg-black/40 border-white/10"
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Slug (ID Interno)</Label>
                                    <div className="h-10 px-3 flex items-center bg-white/5 border border-white/10 rounded text-sm font-mono text-muted-foreground">
                                        {generateTenantId(agencyName) || '...'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Domínio Personalizado</Label>
                                <div className="flex gap-2">
                                    <span className="flex items-center justify-center px-3 bg-white/5 border border-white/10 rounded text-muted-foreground font-bold text-sm">https://</span>
                                    <Input
                                        placeholder="app.agencia.com.br"
                                        className="bg-black/40 border-white/10 font-bold"
                                        value={newDomain}
                                        onChange={(e) => setNewDomain(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Cor da Marca (HEX)</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-white/10 shrink-0 transition-colors"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                        <Input
                                            placeholder="#000000"
                                            className="bg-black/40 border-white/10 font-mono"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Logo URL (Opcional)</Label>
                                    <Input
                                        placeholder="https://..."
                                        className="bg-black/40 border-white/10"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                                <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-black uppercase text-blue-500 mb-1">Quase lá!</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Para que <strong>{newDomain}</strong> funcione, adicione este registro no seu provedor de domínio.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded">
                                    <span className="text-xs font-bold text-muted-foreground uppercase w-16">Tipo</span>
                                    <Badge variant="outline" className="font-mono font-bold">CNAME</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded">
                                    <span className="text-xs font-bold text-muted-foreground uppercase w-16">Nome</span>
                                    <code className="text-sm font-bold text-white">{newDomain.split('.')[0]}</code>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded group cursor-pointer hover:border-primary/50 transition-colors">
                                    <span className="text-xs font-bold text-muted-foreground uppercase w-16">Valor</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-bold text-primary">cname.uniafy.com</code>
                                        <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {step === 'details' ? (
                            <Button
                                onClick={handleGenerateConfig}
                                className="w-full bg-primary text-black font-black uppercase hover:bg-primary/90"
                                disabled={!agencyName || !newDomain}
                            >
                                Gerar Configuração DNS
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinalize}
                                className="w-full bg-green-500 text-black font-black uppercase hover:bg-green-400"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar Agência
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
