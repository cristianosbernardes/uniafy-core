import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GestaoClientes from "./pages/GestaoClientes";
import MeuPerfil from "./pages/MeuPerfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/operacional/dashboard" replace />} />
          
          {/* Mestre Routes */}
          <Route path="/mestre/agencias" element={<GestaoClientes />} />
          
          {/* Agência Routes */}
          <Route path="/agencia/painel" element={<Dashboard />} />
          
          {/* Operacional Routes */}
          <Route path="/operacional/dashboard" element={<Dashboard />} />
          
          {/* Sistema Routes */}
          <Route path="/sistema/perfil" element={<MeuPerfil />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
