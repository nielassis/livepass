import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { CreatePaymentLinkDTO, PaymentListQuery } from './payments.types';
import { createPaymentLinkBodyJsonSchema } from './schemas/createPaymentLink.schema';
import { paymentsListQueryJsonSchema } from './schemas/paymentListQuery.schema';
import {
  createPaymentLink,
  getAllPayments,
  getPaymentById,
} from './payments.service';

export async function publicPaymentsRoutes(app: FastifyInstance) {
  app.post<{ Body: CreatePaymentLinkDTO }>(
    '/payments/link',
    {
      schema: {
        body: createPaymentLinkBodyJsonSchema,
      },
    },
    async (request, reply) => {
      const result = await createPaymentLink(request.body);

      return sendJsonSafe(reply, result);
    },
  );
}

export async function paymentsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', jwtAuth);

  app.get<{ Querystring: PaymentListQuery }>(
    '/payments',
    {
      schema: {
        querystring: paymentsListQueryJsonSchema,
      },
    },
    async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;

      const page = await getAllPayments(
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

  app.get<{ Params: { paymentId: string } }>(
    '/payments/:paymentId',
    async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;
      const { paymentId } = request.params;

      const payment = await getPaymentById(paymentId, {
        organizationId: user.organizationId,
        userId: user.userId,
        role: user.role,
      });

      return sendJsonSafe(reply, payment);
    },
  );
}
