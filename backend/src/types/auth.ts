import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export type OrganizationContextPayload = {
  organizationId: string;
  role: UserRole;
};

export type AuthUserPayload = JwtPayload & {
  userId: string;
  organizationId: string;
  role: UserRole;
};
