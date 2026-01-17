# Plano de Implementação: Fluxo de Assinatura & Gateway (Card Upfront)

## Objetivo
Implementar um fluxo de cadastro seguro e qualificado ("Card Upfront"), onde o usuário deve fornecer dados de cartão válidos e CPF único antes de iniciar o período de teste (Trial). Além disso, transformar o sistema de convites de equipe em um mecanismo real de autenticação via Supabase.

## Estratégia "Card Upfront" (Modelo Netflix)
Este modelo reduz curiosos e fraudes, garantindo que apenas leads qualificados entrem na plataforma.

### 1. Checkout & Validação (Fluxo de Entrada)
- **Página de Checkout**: Substituir o registro simples por um formulário de checkout.
- **Validação de CPF**:
    - Verificar unicidade no banco de dados (`profiles.cpf`).
    - Algoritmo de validação de formato.
    - Bloqueio de múltiplos cadastros com mesmo CPF.
- **Tokenização do Cartão**:
    - Integrar com Gateway (Asaas ou Stripe) no frontend para gerar token do cartão.
    - Validar o cartão (pre-auth) antes de criar o usuário.

### 2. Gestão de Equipe (Usuários Reais)
- **Edge Function para Convites**: 
    - Criar função no Supabase (`invite_user`) que utiliza a API `supabase.auth.admin`.
    - Envia email real para o convidado definir senha.
    - Vincula o convidado à agência (`parent_agency_id`) automaticamente.

### 3. Banco de Dados
- **Novas Colunas em `profiles`**:
    - `cpf` (TEXT, UNIQUE).
    - `gateway_customer_id` (TEXT) - ID do cliente no Asaas/Stripe.
    - `payment_method_token` (TEXT) - Para cobranças futuras.

## Tarefas Técnicas
1.  [ ] Criar Edge Function `invite-team-member`.
2.  [ ] Adicionar coluna `cpf` com constraint UNIQUE em `profiles`.
3.  [ ] Criar Página de Checkout com validação de cartão (integração Gateway).
4.  [ ] Implementar lógica de bloqueio por CPF duplicado.

## Gateway Recomendado
Considerando o mercado brasileiro (CPF, PIX, Cartão Nacional): **Asaas**.
Se o foco for internacional: **Stripe**.
*Aguardando confirmação do usuário.*
