import { FastifyInstance } from 'fastify';
import { login } from './auth.service';
import { loginDTO } from './auth.types';
import { authUserJsonSchema } from './schemas/authUser.schema';

export default async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: loginDTO }>(
    '/login',
    { schema: { body: authUserJsonSchema } },
    async (request, reply) => {
      const { email, password } = request.body;

      const token = await login({ email, password });

      reply.status(200).send(token);
    },
  );
}
