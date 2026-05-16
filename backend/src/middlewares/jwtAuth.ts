import { verify } from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { env } from '../config/env';
import { AuthUserPayload } from '../types/auth';
import { AppError } from '../utils/error';

export async function jwtAuth(req: FastifyRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verify(token, env.JWT_SECRET) as AuthUserPayload;

    req.authUserPayload = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };
  } catch (err) {
    req.log.error({ err }, 'JWT verification failed');
    throw new AppError('Unauthorized', 401);
  }
}
