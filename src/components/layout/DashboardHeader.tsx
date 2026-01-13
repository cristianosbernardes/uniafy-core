import { Power } from 'lucide-react';
import { User } from '@/types/uniafy';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'ADMINISTRADOR_MESTRE';
      case 'TENANT_ADMIN':
        return 'ADMINISTRADOR_AGÊNCIA';
      case 'END_USER':
        return 'OPERADOR';
      default:
        return role;
    }
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-black font-black text-xl">U</span>
        </div>
        <div>
          <h1 className="text-foreground font-black text-base leading-none">UNIAFY <span className="text-primary italic">CORE</span></h1>
          <p className="text-[10px] text-muted-foreground uppercase mt-1 font-medium opacity-60">PRECISION INDUSTRIAL V5.9.6</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-foreground font-bold text-sm leading-none">{user.name.toUpperCase()}</p>
          <p className="text-[10px] text-primary uppercase mt-1 font-bold">
            {getRoleLabel(user.role)}
          </p>
        </div>
        <button className="w-10 h-10 rounded border border-border bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300">
          <Power className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
