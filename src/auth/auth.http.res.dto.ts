import { Expose } from 'class-transformer';

export class AuthLoginHttpResDto {
  @Expose()
  access_token: string;
}
