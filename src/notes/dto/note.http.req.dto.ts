import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class NoteHttpPostReqDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class NoteHttpPutReqDto extends PartialType<NoteHttpPostReqDto>(
  NoteHttpPostReqDto,
) {}
