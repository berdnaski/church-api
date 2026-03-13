import { ChurchRole } from '@prisma/client';

export const LEADERSHIP_ROLES = [
  ChurchRole.OWNER,
  ChurchRole.PASTOR,
  ChurchRole.ADMIN,
  ChurchRole.LEADER,
];

export const ADMIN_ROLES = [
  ChurchRole.OWNER,
  ChurchRole.PASTOR,
  ChurchRole.ADMIN,
];
