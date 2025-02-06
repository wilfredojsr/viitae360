import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolesType } from '@commons/decorators/roles.decorator';
import { RoleAdminGuard } from '@commons/guards/role-admin.guard';

@Injectable()
export class RoleGuard implements CanActivate {
  private static readonly defaultRole = RolesType.General;
  private readonly roleGuardMap: Record<
    RolesType,
    CanActivate | CanActivate[]
  > = {
    [RolesType.Admin]: this.roleAdminGuard,
    [RolesType.General]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly roleAdminGuard: RoleAdminGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roleTypes = this.reflector.getAllAndOverride<RolesType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [RoleGuard.defaultRole];
    const guards = roleTypes.map((type) => this.roleGuardMap[type]).flat();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((error) => {
        console.error(error);
      });

      if (canActivate) {
        return true;
      }
    }

    return false;
  }
}
