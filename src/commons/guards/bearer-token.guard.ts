import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Authorization Header
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      return false;
    }
    const jwt = authHeader.replace('Bearer ', '');
    return this.authService.verifyJWT(jwt);
  }
}
