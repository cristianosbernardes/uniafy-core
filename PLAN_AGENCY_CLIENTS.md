# Plano de Implementação: Carteira de Clientes

## Objetivo
Implementar a interface de gestão de clientes para agências, permitindo visualizar, adicionar e gerenciar o status dos clientes.

## Mudanças Propostas

### 1. Serviço (`agencyService.ts`)
- [x] Adicionar método `getClients(agencyId)` (Já realizado)
- [x] Adicionar método `createClient(agencyId, data)` (Já realizado)

### 2. Interface (`AgencyClients.tsx`)
- Criar tabela de listagem de clientes com as colunas:
    - Cliente (Nome/Email)
    - Plano (Basic/Pro/Enterprise)
    - Status (Ativo/Inativo/Trial)
    - LTV (Lifetime Value - Mockado)
    - Ações (Editar, Acessar Conta)
- Implementar Dialog "Novo Cliente":
    - Campos: Nome, Email, Plano.
    - Ação: Criar registro mockado via service.

## Plano de Verificação

### Testes Manuais (Browser)
1.  Navegar para `/agency/clients`.
2.  Verificar se o título "CARTEIRA DE CLIENTES" é exibido.
3.  Clicar em "Novo Cliente".
4.  Preencher formulário (Nome: "Cliente Teste", Email: "teste@cliente.com").
5.  Salvar e verificar se o cliente aparece na lista (mock local state).
