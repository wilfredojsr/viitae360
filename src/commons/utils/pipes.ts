import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ClassConstructor,
  ClassTransformOptions,
} from 'class-transformer/types/interfaces';
import { parse, stringify } from 'flatted';

const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});

export class Pipes {
  static validationPipe() {
    return validationPipe;
  }

  static transform<S, T>(
    cls: ClassConstructor<T>,
    obj: S | S[],
    options: ClassTransformOptions = {
      enableCircularCheck: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    },
  ): T | T[] {
    if (Array.isArray(obj)) {
      return obj.map(o => plainToInstance(cls, parse(stringify(o)), options));
    }
    return plainToInstance(cls, parse(stringify(obj)), options);
  }
}
