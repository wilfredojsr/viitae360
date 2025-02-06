import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): json {
    return { ok: true };
  }
}
