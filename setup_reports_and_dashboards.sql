-- Tabela para Automações de Relatórios (N8n)
CREATE TABLE IF NOT EXISTS public.report_automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'manual')),
  payload_config JSONB DEFAULT '{}'::jsonb,
  last_run_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela para Dashboards Públicos (Reportei-style)
CREATE TABLE IF NOT EXISTS public.public_dashboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.agency_clients(id) ON DELETE SET NULL, -- Opcional: vincula a um cliente específico
  share_token TEXT NOT NULL UNIQUE,
  config_json JSONB DEFAULT '{}'::jsonb, -- Configuração de quais gráficos exibir
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Apenas a própria agência pode ver/editar suas automações
ALTER TABLE public.report_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can manage their own report automations"
ON public.report_automations
FOR ALL
USING (auth.uid() = agency_id);

-- RLS: Public Dashboards
ALTER TABLE public.public_dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can manage their own public dashboards"
ON public.public_dashboards
FOR ALL
USING (auth.uid() = agency_id);

-- Permitir leitura pública para Dashboards via Token (usaremos função segura ou bypass no backend, mas RLS 'public' é arriscado sem filtro.
-- Melhor estratégia: Criar uma RPC 'get_public_dashboard(token)' que bypassa RLS de forma segura, ou abrir SELECT para anon se souber o token.
-- Por segurança, vamos deixar RLS fechado para anon e usar RPC.

-- Índices
CREATE INDEX IF NOT EXISTS idx_report_automations_agency ON public.report_automations(agency_id);
CREATE INDEX IF NOT EXISTS idx_public_dashboards_token ON public.public_dashboards(share_token);

-- RPC para buscar Dashboard Público de forma segura
CREATE OR REPLACE FUNCTION get_public_dashboard_by_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Executa como admin para bypassar RLS
AS $$
DECLARE
  v_dashboard RECORD;
  v_branding RECORD;
BEGIN
  -- Buscar o dashboard
  SELECT * INTO v_dashboard
  FROM public.public_dashboards
  WHERE share_token = p_token
  AND (expires_at IS NULL OR expires_at > now());

  IF v_dashboard.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Incrementar contador de views
  UPDATE public.public_dashboards SET views_count = views_count + 1 WHERE id = v_dashboard.id;

  -- Buscar Branding da Agência
  SELECT company_name, branding_logo, branding_colors 
  INTO v_branding
  FROM public.profiles
  WHERE id = v_dashboard.agency_id;

  -- Retornar combinação
  RETURN jsonb_build_object(
    'dashboard', row_to_json(v_dashboard),
    'agency', row_to_json(v_branding)
  );
END;
$$;
