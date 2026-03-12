import { SetMetadata } from '@nestjs/common';
import { ChurchRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ChurchRole[]) => SetMetadata(ROLES_KEY, roles);

export const IS_ADMIN_OR_SELF_KEY = 'isAdminOrSelf';
export const IsAdminOrSelf = () => SetMetadata(IS_ADMIN_OR_SELF_KEY, true);
