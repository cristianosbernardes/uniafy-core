import * as React from "react"
import { Check, ChevronsUpDown, Building2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTraffic } from "@/contexts/TrafficContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ClientSwitcher() {
    const [open, setOpen] = React.useState(false)
    const { clients, selectedClient, selectClient, isLoading } = useTraffic()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[280px] justify-between h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white group transition-all"
                >
                    {selectedClient ? (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar className="w-6 h-6 border border-white/10">
                                <AvatarImage src={selectedClient.branding_logo} className="object-cover" />
                                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                                    {selectedClient.company_name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start truncate">
                                <span className="text-xs font-bold text-white leading-none truncate w-[180px] text-left">
                                    {selectedClient.company_name}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-none mt-1">
                                    Uniafy Client
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Search className="w-4 h-4" />
                            <span className="text-xs">Selecione um cliente...</span>
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-zinc-950 border-white/10">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Buscar cliente..." className="h-10" />
                    <CommandList className="max-h-[300px] custom-scrollbar">
                        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                            Nenhum cliente encontrado.
                        </CommandEmpty>
                        <CommandGroup heading="Meus Clientes">
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.company_name}
                                    onSelect={() => {
                                        selectClient(client.id)
                                        setOpen(false)
                                    }}
                                    className="flex items-center gap-3 p-2 aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors"
                                >
                                    <Avatar className="w-8 h-8 rounded-md border border-white/10">
                                        <AvatarImage src={client.branding_logo} />
                                        <AvatarFallback className="bg-zinc-900 text-zinc-500 rounded-md">
                                            <Building2 className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "font-medium text-sm",
                                            selectedClient?.id === client.id ? "text-primary" : "text-white"
                                        )}>
                                            {client.company_name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">{client.email}</span>
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4 text-primary",
                                            selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
