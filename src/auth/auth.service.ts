import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginHttpReqDto } from './auth.http.req.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthLoginHttpReqDto) {
    const whiteList: string = this.configService.get('WHITELIST_AUTH');
    const password = this.configService.get('WHITELIST_PASSWORD');

    const usersAllowed = whiteList
      .split(',')
      .filter((str) => str.includes('@'));

    const userIndex = usersAllowed.findIndex((user) => user === dto.email);

    if (userIndex >= 0 && password.split(',')[userIndex] === dto.password) {
      const jwt = await this.createJWT(dto.email);
      return { access_token: jwt };
    }
    throw new BadRequestException('Invalid credentials');
  }

  async createJWT(sub: string) {
    const payload = { sub };
    const jwt = await this.jwtService.signAsync(payload);
    this.configService.set('JWT', jwt);
    return jwt;
  }

  verifyJWT(token: string) {
    const globalJWT = this.configService.get('JWT');
    const jwtSecret = this.configService.get('JWT_SECRET');
    if (globalJWT !== token) {
      throw new UnauthorizedException();
    }
    return !!this.jwtService.verify(token, jwtSecret);
  }
}
