import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import GestaoClientes from "./pages/GestaoClientes";
import MeuPerfil from "./pages/MeuPerfil";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SqlBank from "./pages/SqlBank";
import GHunter from "./pages/GHunter";
import CnpjSniper from "./pages/CnpjSniper";
import MasterSettings from "./pages/MasterSettings";
import { DashboardShell } from "./components/layout/DashboardShell";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-primary font-mono uppercase tracking-[0.3em] animate-pulse">
          Iniciando Uniafy Core...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main Layout Wrapping Private Routes */}
      <Route element={<PrivateRoute><DashboardShell /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/growth/hunter" replace />} />

        {/* Mestre Routes */}
        <Route path="/mestre" element={<Navigate to="/mestre/agencias" replace />} />
        <Route path="/mestre/agencias" element={<GestaoClientes />} />
        <Route path="/mestre/sql" element={<SqlBank />} />
        <Route path="/mestre/config" element={<MasterSettings />} />

        {/* Growth Engine Routes */}
        <Route path="/growth" element={<Navigate to="/growth/hunter" replace />} />
        <Route path="/growth/hunter" element={<GHunter />} />
        <Route path="/growth/sniper" element={<Dashboard />} />
        <Route path="/growth/cnpj" element={<CnpjSniper />} />
        <Route path="/growth/crm" element={<Dashboard />} />

        {/* Agency OS Routes */}
        <Route path="/agency-os" element={<Navigate to="/agency-os/onboarding" replace />} />
        <Route path="/agency-os/onboarding" element={<Dashboard />} />
        <Route path="/agency-os/squads" element={<Dashboard />} />
        <Route path="/agency-os/financeiro" element={<Dashboard />} />

        {/* Traffic Commander Routes */}
        <Route path="/traffic" element={<Navigate to="/traffic/analytics" replace />} />
        <Route path="/traffic/analytics" element={<Dashboard />} />
        <Route path="/traffic/auditor" element={<Dashboard />} />
        <Route path="/traffic/otimizador" element={<Dashboard />} />

        {/* Client Success Routes */}
        <Route path="/success" element={<Navigate to="/success/portal" replace />} />
        <Route path="/success/portal" element={<Dashboard />} />
        <Route path="/success/aprovacao" element={<Dashboard />} />
        <Route path="/success/health" element={<Dashboard />} />

        {/* Sistema Routes */}
        <Route path="/sistema" element={<Navigate to="/sistema/perfil" replace />} />
        <Route path="/sistema/perfil" element={<MeuPerfil />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
