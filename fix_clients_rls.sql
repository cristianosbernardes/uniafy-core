-- 1. CORREÇÃO DE RLS (Permitir ver clientes)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agencies can view attached clients" ON public.profiles;

CREATE POLICY "Agencies can view attached clients"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = parent_agency_id  -- A agência pode ver quem ela é "pai"
  OR 
  auth.uid() = id -- O próprio usuário pode se ver
  OR
  EXISTS (SELECT 1 FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com' AND id = auth.uid()) -- Mestre vê tudo (opcional)
);

-- 2. INSERIR CLIENTE DE TESTE (Para você ver algo na tela)
-- Isso cria um 'Profile' vinculado ao seu ID (auth.uid() precisa ser pego dinamicamente, aqui faremos um truque)

DO $$
DECLARE
  v_master_id uuid;
BEGIN
  -- Tenta pegar o ID do seu usuário pelo email
  SELECT id INTO v_master_id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com' LIMIT 1;

  IF v_master_id IS NOT NULL THEN
    -- Inserir um cliente vinculado a você
    INSERT INTO public.profiles (id, email, full_name, role, parent_agency_id, company_name, phone)
    VALUES (
      gen_random_uuid(), -- ID falso (sem login real por enquanto)
      'cliente.exemplo@loja.com', 
      'Loja Exemplo Ltda',
      'client',
      v_master_id, -- Vinculado a VOCÊ
      'Móveis Silva',
      '11999999999'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

SELECT 'RLS Corrigido e Cliente de Teste Inserido!' as status;
