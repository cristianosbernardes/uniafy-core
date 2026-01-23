import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BrandingUIProps {

    fsTitle: number;
    setFsTitle: (val: number) => void;
    fsStats: number;
    setFsStats: (val: number) => void;
    fsCardTitle: number;
    setFsCardTitle: (val: number) => void;
    fsMenu: number;
    setFsMenu: (val: number) => void;
    fsSubmenu: number;
    setFsSubmenu: (val: number) => void;
    fsBase: number;
    setFsBase: (val: number) => void;
    radius: number;
    setRadius: (val: number) => void;
    glassBlur: number;
    setGlassBlur: (val: number) => void;
    glassOpacity: number;
    setGlassOpacity: (val: number) => void;
}

export function BrandingUI({

    fsTitle, setFsTitle,
    fsStats, setFsStats,
    fsCardTitle, setFsCardTitle,
    fsMenu, setFsMenu,
    fsSubmenu, setFsSubmenu,
    fsBase, setFsBase,
    radius, setRadius,
    glassBlur, setGlassBlur,
    glassOpacity, setGlassOpacity
}: BrandingUIProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Shapes & Fontes</h2>
                <p className="text-xs text-zinc-500">Ajuste a densidade visual e tipografia do sistema.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Hierarquia de Tamanhos (px)</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Títulos (H1)', val: fsTitle, set: setFsTitle, min: 16, max: 48 },
                            { label: 'Números (KPIs)', val: fsStats, set: setFsStats, min: 16, max: 56 },
                            { label: 'Cards', val: fsCardTitle, set: setFsCardTitle, min: 14, max: 32 },
                            { label: 'Menus', val: fsMenu, set: setFsMenu, min: 8, max: 20 },
                            { label: 'Submenus', val: fsSubmenu, set: setFsSubmenu, min: 10, max: 24 },
                            { label: 'Base', val: fsBase, set: setFsBase, min: 10, max: 18 },
                        ].map((f) => (
                            <div key={f.label} className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-[10px] text-zinc-600">{f.label}</Label>
                                    <span className="text-[10px] font-mono text-primary">{f.val}px</span>
                                </div>
                                <Slider min={f.min} max={f.max} step={1} value={[f.val]} onValueChange={(v) => f.set(v[0])} className="py-1" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl glass-panel border-white/5">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Arredondamento & Vidro</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] text-zinc-600">Border Radius (px)</Label>
                                <span className="text-[10px] font-mono text-primary">{radius}px</span>
                            </div>
                            <Slider min={0} max={32} step={1} value={[radius]} onValueChange={(v) => setRadius(v[0])} className="py-1" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] text-zinc-600">Blur do Vidro (px)</Label>
                                <span className="text-[10px] font-mono text-primary">{glassBlur}px</span>
                            </div>
                            <Slider min={0} max={40} step={1} value={[glassBlur]} onValueChange={(v) => setGlassBlur(v[0])} className="py-1" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] text-zinc-600">Opacidade do Vidro</Label>
                                <span className="text-[10px] font-mono text-primary">{Math.round(glassOpacity * 100)}%</span>
                            </div>
                            <Slider min={0} max={0.2} step={0.01} value={[glassOpacity]} onValueChange={(v) => setGlassOpacity(v[0])} className="py-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
