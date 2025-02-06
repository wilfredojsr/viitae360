import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Viitae360Request } from '@commons/types/viitae360-request';
import { RolesType } from '@commons/decorators/roles.decorator';

@Injectable()
export class RoleAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Viitae360Request>();
    return request.user.role === RolesType.Admin.toString();
  }
}
