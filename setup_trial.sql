-- Busca o ID do usuário pelo email (Assumindo que master@uniafy.com ou o seu email seja o alvo)
-- OBS: Substitua 'cristiano.sbernardes@gmail.com' pelo seu email de login se diferir.

WITH target_user AS (
  SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com' LIMIT 1
)
INSERT INTO public.subscriptions (
  tenant_id,
  plan_id,
  status,
  start_date,
  next_billing_date,
  amount,
  payment_method
)
SELECT 
  target_user.id, -- tenant_id = user_id (para simplificação do SaaS)
  (SELECT id FROM public.plans WHERE name = 'Uniafy Growth' LIMIT 1),
  'trial',
  now(),
  now() + interval '3 days', -- Expira em 3 dias
  0.00,
  'CC'
FROM target_user
ON CONFLICT (id) DO UPDATE -- Se já existir (assumindo id como PK, mas aqui estamos inserindo novo, idealmente updates pelo tenant_id)
-- Como a tabela subscriptions tem ID uuid default, o ON CONFLICT id não vai pegar se inserirmos um novo.
-- Vamos deletar anterior para este tenant para garantir.
SET status = 'trial';

-- Melhor abordagem para o script manual:

DELETE FROM public.subscriptions WHERE tenant_id = (SELECT id FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com');

INSERT INTO public.subscriptions (
  tenant_id,
  plan_id,
  status,
  start_date,
  next_billing_date,
  amount,
  payment_method
)
SELECT 
  id,
  (SELECT id FROM public.plans WHERE name = 'Uniafy Growth' LIMIT 1),
  'trial',
  now(),
  now() + interval '3 days',
  0.00,
  'CC'
FROM auth.users WHERE email = 'cristiano.sbernardes@gmail.com';
