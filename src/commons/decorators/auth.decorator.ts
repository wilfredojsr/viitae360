import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';

export enum AuthType {
  Bearer,
  None,
}

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
