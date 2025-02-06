import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginHttpReqDto } from './dto/auth.http.req.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@auth/entities/user.entity';

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
    const password = this.configService.get('WHITELIST_PASSWORD');

    const { index } = this.findUserByEmail(dto.email);

    if (password.split(',')[index] === dto.password) {
      const jwt = await this.createJWT(dto.email);
      return { access_token: jwt };
    }
    throw new BadRequestException('Invalid credentials');
  }

  findUserByEmail(email: string) {
    const whiteList = this.configService.get('WHITELIST_AUTH').split(',');
    const usersAllowed = whiteList.filter((str) => str.includes('@'));

    const userIndex = whiteList.findIndex((user) => user === email);
    const userIndexForPassword = usersAllowed.findIndex(
      (user) => user === email,
    );

    if (userIndexForPassword < 0) {
      throw new NotFoundException('User not found');
    }

    const user: UserEntity = {
      uuid: whiteList[userIndex + 2],
      role: whiteList[userIndex + 1],
      email: whiteList[userIndex],
    };

    return { index: userIndexForPassword, user };
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
    const jwtVerified = this.jwtService.verify(token, jwtSecret);
    const { user } = this.findUserByEmail(jwtVerified.sub);
    return user;
  }
}
