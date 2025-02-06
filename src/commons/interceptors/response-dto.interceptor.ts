import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_DTO_KEY } from '../decorators/response-dto';
import { Pipes } from '../utils/pipes';
import { PaginatedHttpResDto } from '../dtos/paginated.http.res.dto';
import { Request } from 'express';

@Injectable()
export class ResponseDtoInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const handler = context.getHandler();
        const className = this.reflector.get(RESPONSE_DTO_KEY, handler);

        if (!className) {
          return data;
        }

        if (
          Object.getPrototypeOf(className).name === PaginatedHttpResDto.name
        ) {
          const req: Request = context.switchToHttp().getRequest();
          const { page, per_page } = req.query;
          const [items, counter] = data || [];
          const perPage = +per_page || 10;
          const currentPage = +page || 1;
          const totalPages = Math.ceil((counter ?? 0) / perPage);

          const newQueryParams = Array.from(
            new Set(Object.keys(req.query).filter((key) => key !== 'page')),
          )
            .map((key) => `&${key}=${req.query[key]}`)
            .join('')
            .substring(1);

          return Pipes.transform(className, {
            data: items || [],
            pagination: {
              total: counter ?? 0,
              count: items?.length ?? 0,
              per_page: perPage,
              current_page: currentPage,
              total_pages: totalPages,
            },
            links: {
              self: req.url,
              next:
                items?.length && currentPage < totalPages
                  ? `${req.path}?${newQueryParams}&page=${currentPage + 1}`
                  : undefined,
              prev:
                items?.length && currentPage > 1
                  ? `${req.path}?${newQueryParams}&page=${currentPage - 1}`
                  : undefined,
              first:
                items?.length && totalPages > 1
                  ? `${req.path}?${newQueryParams}&page=1`
                  : undefined,
              last:
                items?.length && totalPages > 1
                  ? `${req.path}?${newQueryParams}&page=${totalPages}`
                  : undefined,
            },
          });
        }

        return Pipes.transform(className, data);
      }),
    );
  }
}
