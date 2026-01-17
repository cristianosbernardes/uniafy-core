# Plano de Implementação: Checkout V2 (Segurança & Card Upfront)

## Objetivo
Substituir a atual página de cadastro (`/auth/register`) por um fluxo de **Checkout Seguro**. O usuário só será criado no banco de dados se passar pela validação de CPF (unicidade) e, opcionalmente, pela pré-autorização do cartão.

## Funcionalidades Chave
1.  **Validação de CPF**:
    - Algoritmo JS para verificar dígito verificador.
    - Consulta ao Supabase (`profiles`) para garantir que o CPF não existe.
2.  **Seleção de Plano**:
    - Usuário escolhe o plano (Basic, Pro, Enterprise) no início.
3.  **Dados de Pagamento (Gateway)**:
    - Se `active_gateway` = 'asaas' ou 'stripe', renderizar campos de cartão.
    - Tokenizar cartão direto com o Gateway (frontend).
    - Enviar token + dados para o backend (Supabase Edge Function ou API).

## Estrutura da Página (`src/pages/auth/Checkout.tsx`)
- **Etapa 1: Identificação**: Nome, Email, Senha, CPF, Celular.
- **Etapa 2: Endereço**: (Necessário para emissão de nota).
- **Etapa 3: Plano & Pagamento**: Resumo do pedido e input de cartão.

## Fluxo Técnico
1.  Frontend valida formato CPF.
2.  Frontend invoca `rpc('check_cpf_availability')` (vamos criar).
3.  Se CPF ok -> Coleta dados de cartão.
4.  Envia para `agencyService.createFullSubscription(data)`.
    - Esse método chamará a Edge Function ou RPC complexa que cria:
        - User (Auth)
        - Profile (com CPF)
        - Customer no Gateway
        - Assinatura
