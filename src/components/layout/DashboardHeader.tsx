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
    <header className="h-16 bg-background border-b border-border-industrial flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">U</span>
        </div>
        <div>
          <h1 className="text-primary font-bold text-sm tracking-wide">UNIAFY ADMIN</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">V5.9.6_PRECISION</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-foreground font-medium text-sm">{user.name}</p>
          <p className="text-primary text-xs uppercase tracking-wider italic">
            {getRoleLabel(user.role)}
          </p>
        </div>
        <button className="w-9 h-9 rounded-full border border-border-industrial flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
          <Power className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
