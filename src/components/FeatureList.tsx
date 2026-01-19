import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";

interface FeatureListProps {
    features: string[];
    onChange: (features: string[]) => void;
}

export function FeatureList({ features, onChange }: FeatureListProps) {
    // Local state for immediate feedback
    const [items, setItems] = useState<string[]>(features);

    // Sync external changes
    useEffect(() => {
        setItems(features);
    }, [features]);

    const handleAdd = () => {
        const newItems = [...items, ""];
        setItems(newItems);
        onChange(newItems);
    };

    const handleRemove = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onChange(newItems);
    };

    const handleChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
        onChange(newItems);
    };

    return (
        <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-zinc-400 tracking-wider flex justify-between items-end">
                <span>Funcionalidades</span>
                <span className="text-[10px] text-zinc-600 font-normal normal-case">{items.length} itens</span>
            </Label>

            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {items.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                        <GripVertical className="w-4 h-4 text-zinc-700 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Input
                            value={feature}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="bg-black/40 border-white/20 text-white h-9 text-xs focus:border-orange-500/50"
                            placeholder="Descreva a funcionalidade..."
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            className="h-9 w-9 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-white/10 rounded-lg text-zinc-600 text-xs">
                        Nenhuma funcionalidade adicionada.
                    </div>
                )}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAdd}
                className="w-full border-dashed border-white/20 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs h-8"
            >
                <Plus className="w-3.5 h-3.5 mr-2" /> Adicionar Item
            </Button>
        </div>
    );
}
