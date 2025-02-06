import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginHttpReqDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
