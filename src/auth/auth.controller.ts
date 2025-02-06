import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginHttpReqDto } from './dto/auth.http.req.dto';
import { Auth, AuthType } from '@commons/decorators/auth.decorator';
import { AuthLoginHttpResDto } from '@auth/dto/auth.http.res.dto';
import { ResponseDTO } from '@commons/decorators/response-dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Auth(AuthType.None)
  @ResponseDTO(AuthLoginHttpResDto)
  @Post('/login')
  async login(@Body() dto: AuthLoginHttpReqDto) {
    return this.authService.login(dto);
  }
}
