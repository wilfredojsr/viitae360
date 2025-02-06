import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export const RESPONSE_DTO_KEY = 'ResponseDTO';

export const ResponseDTO = <T>(classSymbol: ClassConstructor<T>) =>
  SetMetadata(RESPONSE_DTO_KEY, classSymbol);
