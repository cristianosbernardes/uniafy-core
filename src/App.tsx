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

      <Route path="/" element={<PrivateRoute><Navigate to="/growth/hunter" replace /></PrivateRoute>} />

      {/* Mestre Routes */}
      <Route path="/mestre/agencias" element={<PrivateRoute><GestaoClientes /></PrivateRoute>} />
      <Route path="/mestre/sql" element={<PrivateRoute><SqlBank /></PrivateRoute>} />

      {/* Growth Engine Routes */}
      <Route path="/growth/hunter" element={<PrivateRoute><GHunter /></PrivateRoute>} />
      <Route path="/growth/crm" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Agency OS Routes */}
      <Route path="/agency-os/onboarding" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/agency-os/squads" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/agency-os/financeiro" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Traffic Commander Routes */}
      <Route path="/traffic/analytics" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/traffic/auditor" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/traffic/otimizador" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Client Success Routes */}
      <Route path="/success/portal" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/success/aprovacao" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/success/health" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Sistema Routes */}
      <Route path="/sistema/perfil" element={<PrivateRoute><MeuPerfil /></PrivateRoute>} />

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
