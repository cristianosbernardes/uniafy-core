# Expanção Multi-Gateway (Cofre API)

## Objetivo
Permitir o cadastro de credenciais para múltiplos gateways (Stripe, Asaas, Kiwify, Hotmart) e adicionar um controle global para definir qual gateway está **ATIVO** para processar novas assinaturas.

## Estratégia de Implementação

### 1. Banco de Dados
- **Tabela `vault_secrets`**: Já suporta múltiplos providers. Apenas padronizaremos os slugs: `kiwify`, `hotmart`, `asaas`, `stripe`.
- **Tabela `master_config`**: Adicionar coluna `active_gateway` (TEXT) para armazenar qual integração deve ser usada pelo backend/checkout.

### 2. Frontend (Vault.tsx)
- **Seção de Provedores**: Criar cards/abas para cada gateway.
- **Campos Específicos**:
    - **Kiwify**: Access Token, Account ID (se aplicável), Webhook Secret.
    - **Hotmart**: Client ID, Client Secret, Webhook Token.
- **Seletor de Gateway Ativo**: Um "Radio Group" ou "Select" no topo da página para definir quem processa pagamentos.

### 3. Integração (Futuro)
- O checkout lerá `master_config.active_gateway` para decidir qual script carregar ou qual API chamar.
