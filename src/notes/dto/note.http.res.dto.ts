import { PaginatedHttpResDto } from '@commons/dtos/paginated.http.res.dto';
import { Expose, Type } from 'class-transformer';

export class NoteHttpResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;
}

export class NotesPaginatedHttpResDto extends PaginatedHttpResDto<NoteHttpResDto> {
  @Type(() => NoteHttpResDto)
  data: NoteHttpResDto[];
}
