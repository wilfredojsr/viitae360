import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { UserEntity } from '@auth/entities/user.entity';
import { Viitae360Request } from '@commons/types/viitae360-request';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Authorization Header
    const request = context.switchToHttp().getRequest<Viitae360Request>();
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      return false;
    }
    const jwt = authHeader.replace('Bearer ', '');
    request.user = this.authService.verifyJWT(jwt);

    return !!request.user;
  }
}
