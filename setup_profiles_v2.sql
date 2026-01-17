-- setup_profiles_v2.sql
-- Objetivo: Atualizar tabela profiles para suportar Trial e White Label
-- Criado em: 2026-01-17

-- 1. Adicionar colunas para Controle de Trial e Assinatura
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing';

-- 2. Adicionar colunas para White Label (Agência)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS branding_logo TEXT,
ADD COLUMN IF NOT EXISTS branding_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}';

-- 3. Atualizar a função handle_new_user para inicializar Trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    created_at, 
    updated_at,
    trial_start_date, -- Inicializa o Trial
    subscription_status -- Define status inicial
  )
  VALUES (
    new.id, 
    new.email, 
    'user', -- Role padrão (pode ser ajustado)
    NOW(), 
    NOW(),
    NOW(), -- Trial começa agora
    'trialing' -- Status de teste
  );
  RETURN new;
END;
$function$;
