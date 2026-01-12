import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { User, UserRole } from '@/types/uniafy';

interface DashboardShellProps {
  children: React.ReactNode;
}

// Mock user - in production this comes from auth
const mockUser: User = {
  id: '1',
  name: 'Cristiano bernardes',
  email: 'cristiano@uniafy.com',
  role: UserRole.SUPER_ADMIN,
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [activeModule, setActiveModule] = useState('operacional');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader user={mockUser} />
      
      <div className="flex-1 flex">
        <ModuleSidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          userRole={mockUser.role}
        />
        
        <ContextSidebar 
          activeModule={activeModule}
          userRole={mockUser.role}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
