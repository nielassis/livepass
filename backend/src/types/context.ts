import { UserRole } from '@prisma/client';

export type OrganizationContext = {
  userId: string;
  organizationId: string;
  role: UserRole;
};
