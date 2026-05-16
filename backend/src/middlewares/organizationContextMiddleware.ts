import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/error';

export async function organizationContextMiddleware(
  req: FastifyRequest<{ Params?: { organizationId?: string } }>,
  reply: FastifyReply,
) {
  const authUser = req.authUserPayload;

  if (!authUser) {
    return reply.status(401).send({ message: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      organizationId: true,
      role: true,
    },
  });

  if (!user || !user.organizationId) {
    throw new AppError('User not found or not associated with a tenant', 404);
  }

  if (
    req.params?.organizationId &&
    req.params.organizationId !== user.organizationId
  ) {
    throw new AppError('Cross-tenant access is not allowed', 403);
  }

  req.authUserPayload = {
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  };

  req.organizationContext = {
    organizationId: user.organizationId,
    role: user.role,
  };
}
