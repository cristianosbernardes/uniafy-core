import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { NAV_MODULES } from '@/config/navigation';
import { User, UserRole } from '@/types/uniafy';

interface DashboardShellProps {
  children?: React.ReactNode;
}

// Mock user - in production this comes from auth
const mockUser: User = {
  id: '1',
  name: 'Cristiano bernardes',
  email: 'cristiano@uniafy.com',
  role: UserRole.SUPER_ADMIN,
};

export function DashboardShell({ children }: DashboardShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Extrai o primeiro segmento da URL como o módulo ativo (ex: /master/sql -> master)
  const activeModule = location.pathname.split('/')[1] || 'prospeccao';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader user={mockUser} />
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        <ModuleSidebar
          activeModule={activeModule}
          onModuleChange={(moduleId) => {
            const module = NAV_MODULES.find(m => m.id === moduleId);
            if (module && module.items.length > 0) {
              navigate(module.items[0].path);
            }
          }}
          userRole={mockUser.role}
        />

        <ContextSidebar
          activeModule={activeModule}
          userRole={mockUser.role}
        />

        <main
          className="flex-1 overflow-auto bg-background"
          style={{
            marginLeft: 'calc(var(--module-sidebar-width, 64px) + (var(--context-sidebar-width, 256px)))'
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
