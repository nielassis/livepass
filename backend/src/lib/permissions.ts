import { UserRole } from '@prisma/client';
import { OrganizationContext } from '../types/context';
import { AppError } from '../utils/error';

function isAdmin(context: OrganizationContext) {
  return context.role === UserRole.ADMIN;
}

function hasHighPrivileges(context: OrganizationContext) {
  return (
    context.role === UserRole.ADMIN || context.role === UserRole.SUPERVISOR
  );
}

function hasLowPrivileges(context: OrganizationContext) {
  return context.role === UserRole.COLLABORATOR;
}

export const Permissions = {
  assertAdminPrivileges(context: OrganizationContext): void {
    if (!isAdmin(context)) {
      throw new AppError('Apenas ADMIN pode realizar essa ação', 403);
    }
  },

  assertHighPrivileges(context: OrganizationContext): void {
    if (!hasHighPrivileges(context)) {
      throw new AppError(
        'Apenas ADMIN e SUPERVISOR podem realizar essa ação',
        403,
      );
    }
  },

  assertLowPrivileges(context: OrganizationContext): void {
    if (!hasLowPrivileges(context)) {
      throw new AppError('Apenas COLABORADOR podem realizar essa ação', 403);
    }
  },
};
