import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import {
    UploadCloud,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Download,
    Database,
    RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// --- MOCK HISTORY DATA ---
interface ImportJob {
    id: string;
    date: string;
    filename: string;
    records: number;
    matched: number;
    platform: string;
    status: 'completed' | 'processing' | 'error';
}

const MOCK_HISTORY: ImportJob[] = [
    { id: '1', date: 'Hoje, 10:30', filename: 'vendas_janeiro_final.csv', records: 1250, matched: 890, platform: 'Meta Ads', status: 'completed' },
    { id: '2', date: 'Ontem, 18:15', filename: 'leads_crm_export.xlsx', records: 500, matched: 410, platform: 'Google Ads', status: 'completed' },
    { id: '3', date: '19/05/2024', filename: 'base_clientes_antiga.csv', records: 5000, matched: 0, platform: 'Meta Ads', status: 'error' },
];

export default function OfflineConversions() {
    const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Processing
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const nextStep = () => {
        if (step === 1 && !file) {
            toast.error("Selecione um arquivo primeiro.");
            return;
        }
        if (step === 2) {
            // Simulate processing
            setStep(3);
            let p = 0;
            const interval = setInterval(() => {
                p += 5;
                setProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    toast.success("Importação concluída com sucesso!");
                }
            }, 100);
        } else {
            setStep(step + 1);
        }
    };

    const reset = () => {
        setStep(1);
        setFile(null);
        setProgress(0);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <PageHeader
                title="CONVERSÕES"
                titleAccent="OFFLINE"
                subtitle="Enriqueça a inteligência das campanhas com dados reais de vendas"
                badge="TRÁFEGO"
            />

            <div className="grid lg:grid-cols-3 gap-8">

                {/* --- LEFT: UPLOAD WIZARD --- */}
                <Card className="lg:col-span-2 border-border/50 shadow-lg relative overflow-hidden">
                    {/* Progress Bar Top */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                        />
                    </div>

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                {step}
                            </span>
                            {step === 1 && "Upload de Dados"}
                            {step === 2 && "Mapeamento de Colunas"}
                            {step === 3 && "Processamento"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Importe sua planilha de vendas (.csv ou .xlsx)."}
                            {step === 2 && "Identifique as colunas para o sistema entender."}
                            {step === 3 && "Enviando dados para as plataformas de anúncio..."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="min-h-[300px] flex flex-col justify-center">

                        {/* STEP 1: UPLOAD */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors group cursor-pointer relative">
                                    <Input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept=".csv,.xlsx"
                                    />
                                    <div className="bg-muted p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        {file ? file.name : "Arraste sua planilha aqui"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {file ? "Arquivo pronto para análise" : "Ou clique para selecionar do computador"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center text-sm text-muted-foreground bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                                    <span className="flex items-center gap-2">
                                        <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                                        Precisa de um modelo?
                                    </span>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-blue-500">
                                        Baixar Template CSV
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: MAPPING */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/50">
                                    <Label className="text-muted-foreground">Coluna no Arquivo</Label>
                                    <Label className="text-muted-foreground">Campo no Sistema</Label>
                                </div>

                                <MappingRow fileCol="Email do Cliente" sysCol="Email (SHA256)" />
                                <MappingRow fileCol="Valor da Compra" sysCol="Value" />
                                <MappingRow fileCol="Data da Venda" sysCol="Event Time" />
                                <MappingRow fileCol="ID da Transação" sysCol="Order ID" />

                                <div className="bg-amber-500/10 p-3 rounded-md flex items-start gap-3 mt-4">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                    <p className="text-xs text-amber-200/80">
                                        Atenção: 24 linhas do arquivo parecem estar sem e-mail. Elas serão ignoradas na importação.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PROCESSING */}
                        {step === 3 && (
                            <div className="flex flex-col items-center justify-center space-y-6 py-8">
                                {progress < 100 ? (
                                    <>
                                        <div className="relative w-24 h-24">
                                            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                                                {progress}%
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground animate-pulse">Cruzando dados com Pixels...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Sucesso!</h3>
                                        <p className="text-center text-muted-foreground max-w-xs">
                                            Processamos 1.250 linhas. <br />
                                            <span className="text-emerald-500 font-bold">890 conversões</span> foram atribuídas a campanhas.
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border/50 p-6 bg-muted/5">
                        {step > 1 && step < 3 && (
                            <Button variant="ghost" onClick={() => setStep(step - 1)}>
                                Voltar
                            </Button>
                        )}
                        <div className="ml-auto">
                            {step < 3 ? (
                                <Button onClick={nextStep} disabled={!file && step === 1}>
                                    {step === 1 ? "Continuar para Mapeamento" : "Iniciar Importação"} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={reset} disabled={progress < 100}>
                                    Nova Importação <RefreshCw className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>

                {/* --- RIGHT: HISTORY --- */}
                <div className="space-y-6">
                    <Card className="h-full border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Database className="w-4 h-4 text-muted-foreground" />
                                Histórico de Uploads
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="pl-6">Data / Arquivo</TableHead>
                                        <TableHead className="text-right pr-6">Match Rate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_HISTORY.map((job) => (
                                        <TableRow key={job.id} className="border-border/50 hover:bg-muted/5">
                                            <TableCell className="pl-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{job.filename}</span>
                                                    <span className="text-xs text-muted-foreground">{job.date} • {job.platform}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {job.status === 'error' ? (
                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Falha</Badge>
                                                ) : (
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-emerald-500">{((job.matched / job.records) * 100).toFixed(0)}%</span>
                                                        <span className="text-[10px] text-muted-foreground">{job.matched} de {job.records}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function MappingRow({ fileCol, sysCol }: { fileCol: string, sysCol: string }) {
    return (
        <div className="grid grid-cols-2 gap-4 items-center mb-3">
            <div className="bg-muted/20 border border-border/50 p-2.5 rounded text-sm text-foreground">
                {fileCol}
            </div>
            <div className="relative">
                <ArrowRight className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Select defaultValue={sysCol}>
                    <SelectTrigger className="h-10 bg-background/50 border-primary/30 ring-1 ring-primary/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={sysCol}>{sysCol}</SelectItem>
                        <SelectItem value="ignore">Ignorar Coluna</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
