# Walkthrough: Módulos Core da Agência

Implementamos a estrutura fundamental do ecossistema de Agência no App Uniafy.

## 1. Setup White Label
Interface completa para personalização da marca da agência.
- **Domínio Personalizado**: Formulário para configurar CNAME/Subdomínio.
- **Identidade Visual**: Upload de Logo e Seletor (Color Picker) para cores Primária/Secundária.
- **Preview**: Visualização em tempo real das cores aplicadas em componentes.

## 2. Gestão de Usuários & Time
Controle de acesso para a equipe da agência.
- **Listagem**: Tabela com membros, cargos e status.
- **Convites**: Fluxo de "Novo Membro" (Mockado) para adicionar agentes ou administradores.
- **Service**: Método `inviteMember` preparado para integração futura com Edge Functions de e-mail.

## 3. Carteira de Clientes (CRM)
Central de gestão dos clientes atendidos pela agência.
- **Listagem Inteligente**: Visão rápida de status (Ativo/Trial/Inadimplente), Plano Contratado e LTV.
- **Ações**: Menu de contexto pronto para "Acessar como Ghost" (Futuro) e Editar.
- **Cadastro**: Modal de "Novo Cliente" funcional com inserção de dados mockados para teste.

## Status de Verificação
- [x] Rota `/agency/whitelabel`: UI carregada, abas funcionais.
- [x] Rota `/agency/users`: UI carregada, Modal de convite abre.
- [x] Rota `/agency/clients`: UI carregada com dados mockados, CRUD simulado via Service.
