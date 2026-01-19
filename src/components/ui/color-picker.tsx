import { useState, useEffect } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { tailwindHslToHex, hexToTailwindHsl, hexToHsl, hslToHex } from "@/lib/color-utils";
import { Paintbrush, X, Check, Copy, ChevronDown } from "lucide-react";

interface ColorPickerProps {
    value: string; // "H S% L%" or "H S% L% / A" (Tailwind format)
    onChange: (newValue: string) => void;
    label?: string;
}

type ColorMode = 'HEX' | 'RGB' | 'HSL';

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
    const [hex, setHex] = useState("#000000");
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ColorMode>('HEX');
    const [copied, setCopied] = useState(false);

    // Sync input value "H S% L%" -> Hex 
    useEffect(() => {
        setHex(tailwindHslToHex(value));
    }, [value]);

    const handleHexChange = (newHex: string) => {
        setHex(newHex);
        // Only trigger onChange if it's a valid complete change to avoid spamming if typing
        // But for picker drag, we need it. Debounce if needed? 
        // For now direct is fine.
        const hsl = hexToTailwindHsl(newHex);
        onChange(hsl);
    };

    const copyToClipboard = () => {
        let textToCopy = hex;
        const { h, s, l, a } = hexToHsl(hex);

        if (mode === 'RGB') {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            textToCopy = a < 1
                ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
                : `rgb(${r}, ${g}, ${b})`;
        } else if (mode === 'HSL') {
            textToCopy = a < 1
                ? `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`
                : `hsl(${h}, ${s}%, ${l}%)`;
        }

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleMode = () => {
        if (mode === 'HEX') setMode('RGB');
        else if (mode === 'RGB') setMode('HSL');
        else setMode('HEX');
    };

    const { h, s, l, a } = hexToHsl(hex);
    // RGB calculation for display
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Handle Opacity Slider
    const handleOpacityChange = (newOpacity: number) => {
        // Construct new Hex with alpha
        // HSL -> Hex with new Alpha
        const newHex = hslToHex(h, s, l, newOpacity);
        handleHexChange(newHex);
    };

    return (
        <div className="space-y-2">
            {label && <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">{label}</Label>}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal bg-[#0A0A0A] border-white/10 hover:bg-white/5 h-10 px-3 relative group transition-all hover:border-white/20"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-md border border-white/10 shadow-inner relative overflow-hidden"
                            >
                                {/* Checkerboard background for transparency */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzMzMiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzMzIi8+PC9zdmc+')] opacity-50" />
                                <div className="absolute inset-0" style={{ backgroundColor: hex }} />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">{hex.substring(0, 7)}</span>
                                {a < 1 && <span className="text-[9px] text-zinc-500">{Math.round(a * 100)}% Opacity</span>}
                            </div>
                        </div>

                        <div className="text-zinc-600 group-hover:text-white transition-colors">
                            <Paintbrush className="w-4 h-4" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3 bg-[#111] border-white/10 shadow-2xl rounded-xl">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">Seletor de Cor</h4>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white" onClick={() => setIsOpen(false)}>
                                <X className="w-3 h-3" />
                            </Button>
                        </div>

                        <div className="flex justify-center pb-2">
                            {/* Force HexAlphaColorPicker class for styling if needed */}
                            <HexAlphaColorPicker color={hex} onChange={handleHexChange} style={{ width: '100%', height: '160px' }} />
                        </div>

                        {/* Opacity Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-zinc-500 uppercase">
                                <span>Opacidade</span>
                                <span>{Math.round(a * 100)}%</span>
                            </div>
                            <Slider
                                value={[a]}
                                min={0}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => handleOpacityChange(val[0])}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded border border-white/10 shrink-0 shadow-inner relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzMzMiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzMzIi8+PC9zdmc+')] opacity-50" />
                                    <div className="absolute inset-0" style={{ backgroundColor: hex }} />
                                </div>

                                <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-2">
                                    {/* Input Area based on Mode */}
                                    <div className="bg-black/40 rounded border border-white/10 flex items-center px-1 h-8">
                                        {mode === 'HEX' && (
                                            <Input
                                                value={hex.toUpperCase()}
                                                onChange={(e) => handleHexChange(e.target.value)}
                                                className="h-full border-none bg-transparent text-xs font-mono text-center uppercase focus-visible:ring-0 p-0 w-full"
                                            />
                                        )}
                                        {mode === 'RGB' && (
                                            <div className="flex items-center gap-1 px-1 w-full justify-between">
                                                <input className="w-8 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={isNaN(r) ? 0 : r} readOnly />
                                                <span className="text-zinc-600 text-[10px]">,</span>
                                                <input className="w-8 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={isNaN(g) ? 0 : g} readOnly />
                                                <span className="text-zinc-600 text-[10px]">,</span>
                                                <input className="w-8 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={isNaN(b) ? 0 : b} readOnly />
                                            </div>
                                        )}
                                        {mode === 'HSL' && (
                                            <div className="flex items-center gap-1 px-1 w-full justify-between">
                                                <input className="w-7 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={h} readOnly />
                                                <span className="text-zinc-600 text-[10px]">°</span>
                                                <input className="w-7 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={s} readOnly />
                                                <span className="text-zinc-600 text-[10px]">%</span>
                                                <input className="w-7 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none" value={l} readOnly />
                                                <span className="text-zinc-600 text-[10px]">%</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleMode}
                                        className="h-8 px-2 text-[10px] font-mono text-zinc-400 hover:text-white border border-white/5 bg-white/5 hover:bg-white/10"
                                    >
                                        {mode}
                                        <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                                    </Button>
                                </div>
                            </div>

                            {/* Copy Utility */}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={copyToClipboard}
                                className="w-full h-7 text-[10px] uppercase bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                            >
                                {copied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                                {copied ? 'Copiado!' : `Copiar ${mode}`}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
