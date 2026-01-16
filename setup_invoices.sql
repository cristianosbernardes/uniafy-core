-- PROMPT TÉCNICO: SETUP FINANCEIRO (INVOICES & GATEWAY)
-- Objetivo: Preparar banco de dados para histórico de pagamentos e integração futura (Stripe/Asaas)

-- 1. Tabela de Faturas (Invoices)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'open', 'void', 'uncollectible', 'pending')),
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    invoice_url TEXT, -- Link para PDF/Boleto
    gateway_id TEXT, -- ID no Stripe/Asaas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Atualizar Tabela de Assinaturas (Subscriptions)
-- Adiciona campos para controle externo do Gateway
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS gateway_customer_id TEXT,
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS gateway_subscription_id TEXT,
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- 3. RLS (Segurança)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Agência vê suas próprias faturas
CREATE POLICY "Agency View Invoices" ON invoices
    FOR SELECT
    USING (auth.uid() = tenant_id);

-- Master vê todas as faturas (Via Service Role ou Admin Policy se necessário)
-- Assumindo que o Master usa dashboard administrativo que pode bypassar ou tem policy específica
-- CREATE POLICY "Master View All" ... (Geralmente admin usa role com bypass)

-- 4. Função Helper: Gerar Fatura Mock (Para testes manuais)
CREATE OR REPLACE FUNCTION generate_mock_invoice(
    p_tenant_id UUID,
    p_amount NUMERIC
) RETURNS UUID AS $$
DECLARE
    v_sub_id UUID;
    v_invoice_id UUID;
BEGIN
    -- Busca assinatura ativa
    SELECT id INTO v_sub_id FROM subscriptions WHERE tenant_id = p_tenant_id LIMIT 1;
    
    INSERT INTO invoices (subscription_id, tenant_id, amount, status, due_date, paid_at, created_at)
    VALUES (
        v_sub_id,
        p_tenant_id,
        p_amount,
        'paid',
        now(),
        now(),
        now()
    ) RETURNING id INTO v_invoice_id;
    
    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;
