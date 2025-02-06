import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum RolesType {
  Admin = 'admin',
  General = 'general',
}

export const Roles = (...rolesTypes: RolesType[]) =>
  SetMetadata(ROLES_KEY, rolesTypes);
