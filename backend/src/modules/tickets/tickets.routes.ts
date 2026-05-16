import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { TicketListQuery } from './tickets.types';
import { ticketsListQueryJsonSchema } from './schemas/ticketListQuery.schema';
import { findTicketParamJsonSchema } from './schemas/findTicketParam.schema';
import { getAllTickets, getTicketById } from './tickets.service';

export async function ticketsRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.get<{ Querystring: TicketListQuery }>(
      '/tickets',
      {
        schema: {
          querystring: ticketsListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await getAllTickets(
          {
            organizationId: user.organizationId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, page);
      },
    );

    panel.get<{ Params: { ticketId: string } }>(
      '/tickets/:ticketId',
      {
        schema: {
          params: findTicketParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { ticketId } = request.params;

        const ticket = await getTicketById(ticketId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, ticket);
      },
    );
  });
}