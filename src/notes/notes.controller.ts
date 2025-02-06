import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteHttpPostReqDto, NoteHttpPutReqDto } from './dto/note.http.req.dto';
import { AuthUser } from '@commons/decorators/auth-user.decorator';
import { UserEntity } from '@auth/entities/user.entity';
import { ResponseDTO } from '@commons/decorators/response-dto';
import {
  NoteHttpResDto,
  NotesPaginatedHttpResDto,
} from './dto/note.http.res.dto';
import { Roles, RolesType } from '@commons/decorators/roles.decorator';

@Controller('notes')
export class NotesController {
  constructor(
    @Inject(NotesService)
    private readonly notesService: NotesService,
  ) {}

  @Post()
  @ResponseDTO(NoteHttpResDto)
  create(
    @AuthUser() authUser: UserEntity,
    @Body() createNoteDto: NoteHttpPostReqDto,
  ) {
    return this.notesService.create(createNoteDto, authUser);
  }

  @Get()
  @ResponseDTO(NotesPaginatedHttpResDto)
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ResponseDTO(NoteHttpResDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.findOne(id);
  }

  @Post(':id/enrich')
  @ResponseDTO(NoteHttpResDto)
  enrichNote(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.enrichNote(id);
  }

  @Put(':id')
  @ResponseDTO(NoteHttpResDto)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDto: NoteHttpPutReqDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @Roles(RolesType.Admin)
  @ResponseDTO(NoteHttpResDto)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.remove(id);
  }
}
