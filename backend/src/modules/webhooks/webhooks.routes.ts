import { FastifyInstance } from 'fastify';
import { handleMercadoPagoWebhook } from './webhooks.service';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { AppError } from '../../utils/error';

export async function webhooksRoutes(app: FastifyInstance) {
  app.post(
    '/webhooks/mercadopago',
    async (request, reply) => {
      try {
        const body = request.body as { topic?: string; data?: { id?: string } };

        if (!body.topic || !body.data?.id) {
          throw new AppError('Payload inválido', 400);
        }

        const result = await handleMercadoPagoWebhook(body.topic, body.data.id);

        return reply.status(200).send(result);
      } catch (error) {
        app.log.error(error);
        return reply.status(200).send({ received: true });
      }
    },
  );

  app.get(
    '/webhooks/mercadopago',
    async (_request, reply) => {
      return reply.status(200).send({ status: 'Webhook activo' });
    },
  );
}