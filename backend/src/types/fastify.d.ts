import 'fastify';
import { AuthUserPayload, OrganizationContextPayload } from './auth';

declare module 'fastify' {
  interface FastifyRequest {
    organizationContext?: OrganizationContextPayload;
    authUserPayload?: AuthUserPayload;
  }
}
