import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { CreateEventDTO, EventListQuery } from './events.types';
import { createEventBodyJsonSchema } from './schemas/createEvent.schema';
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEvent,
} from './events.service';
import { eventsListQueryJsonSchema } from './schemas/eventListQuery.schema';
import { findEventParamJsonSchema } from './schemas/findEventParam.schema';
import { updateEventBodyJsonSchema } from './schemas/updateEvent.schema';

export async function customersRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);
    panel.post<{ Body: CreateEventDTO }>(
      '/events',
      {
        schema: {
          body: createEventBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const customer = await createEvent(request.body, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, customer);
      },
    );

    panel.get<{ Querystring: EventListQuery }>(
      '/events',
      {
        schema: {
          querystring: eventsListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await getAllEvents(
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

    panel.get<{ Params: { eventId: string } }>(
      '/events/:eventId',
      {
        schema: {
          params: findEventParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { eventId } = request.params;

        const customer = await getEventById(eventId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, customer);
      },
    );

    panel.put<{ Params: { eventId: string }; Body: Partial<CreateEventDTO> }>(
      '/customers/:eventId',
      {
        schema: {
          params: findEventParamJsonSchema,
          body: updateEventBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { eventId } = request.params;

        const customer = await updateEvent(eventId, request.body, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, customer);
      },
    );

    panel.delete<{ Params: { eventId: string } }>(
      '/customers/:eventId',
      {
        schema: {
          params: findEventParamJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;
        const { eventId } = request.params;

        const result = await deleteEventById(eventId, {
          organizationId: user.organizationId,
          userId: user.userId,
          role: user.role,
        });

        return sendJsonSafe(reply, result);
      },
    );
  });
}
