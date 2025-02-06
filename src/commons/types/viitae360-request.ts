import { Request } from 'express';
import { UserEntity } from '@auth/entities/user.entity';

export interface Viitae360Request extends Request {
  user: UserEntity;
}
