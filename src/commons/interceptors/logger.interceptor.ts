import {
  CallHandler,
  ExecutionContext,
  Injectable, Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      return next.handle();
    }
    const startTime = Date.now();
    this.logger.log(`Request URL: ${request.method} ${request.url}`);
    return next.handle().pipe(
      tap({
        next: () => {
          const elapsedTime = Date.now() - startTime;
          this.logger.log(`Response Time: ${elapsedTime}ms`);
        },
        error: (error) => {
          const elapsedTime = Date.now() - startTime;
          this.logger.log(`Response Time: ${elapsedTime}ms`);
          this.logger.error(request, error);
        },
      }),
    );
  }
}
