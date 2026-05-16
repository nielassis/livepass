REGRAS

modulos
/src/modules/auth
/src/modules/users
/src/modules/events
/src/modules/tickets
/src/modules/buyers
/src/modules/payments
/src/modules/webhooks

Integrações: Mercado Pago (Checkout Bricks) e seus webhooks

Users:

- Apenas ADMIN pode criar novos usuários para mesma organizationId
- usuários com roles diferentes, permissões diferentes (src/lib/permissions.ts)

Events:

- Supervisores ou Admin podem criar novos eventos para mesma organizationId
- todos os usuários podem listar eventos
- deve ser páginado

Buyers:

- Referente a quem vai comprar o ingresso
- Só deve ser criado quando link de pagamento do mercado pago for gerado
- nenhum usuário pode criar buyers

Tickets:

- Ingressos dos compradores, só eles tem acesso, via email
- Só deve ser criado quando link de pagamento do mercado pago for pago
- nenhum usuário pode criar tickets

Payments:

- Só deve ser criado quando link de pagamento do mercado pago criado, pode marcar como pago, pendente etc...
- nenhum usuário pode criar payments
- todos os usuários podem listar payments
