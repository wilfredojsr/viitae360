import { IsOptional, IsPositive, Max } from 'class-validator';
import { Expose } from 'class-transformer';

export enum QueryHttpReqEnum {
  DEFAULT_PAGE = 1,
  DEFAULT_PER_PAGE = 255,
}

export class QueryHttpReqDto {
  @Expose()
  @IsOptional()
  criteria?: string = '';

  @Expose()
  @IsOptional()
  @IsPositive()
  page: number = QueryHttpReqEnum.DEFAULT_PAGE;

  @Expose()
  @IsOptional()
  @IsPositive()
  @Max(255)
  per_page: number = QueryHttpReqEnum.DEFAULT_PER_PAGE;
}
