import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { BuyerListQuery } from './buyers.types';
import { buyersListQueryJsonSchema } from './schemas/buyerListQuery.schema';
import { findBuyerParamJsonSchema } from './schemas/findBuyerParam.schema';
import { getAllBuyers, getBuyerById } from './buyers.service';

export async function buyersRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.get<{ Querystring: BuyerListQuery }>(
      '/buyers',
      {
        schema: {
          querystring: buyersListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await getAllBuyers(
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

    panel.get<{ Params: { buyerId: string } }>(
      '/buyers/:buyerId',
      {
        schema: {
          params: findBuyerParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { buyerId } = request.params;

        const buyer = await getBuyerById(buyerId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, buyer);
      },
    );
  });
}