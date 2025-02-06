import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NoteHttpPostReqDto, NoteHttpPutReqDto } from './dto/note.http.req.dto';
import { NoteEntity } from './entities/note.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@auth/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  create(createNoteDto: NoteHttpPostReqDto, authUser: UserEntity) {
    const newNote: NoteEntity = {
      ...createNoteDto,
      id: uuidv4(),
      userId: authUser.uuid,
      createdAt: new Date(),
    };
    const notes = this.configService.get('NOTES') || [];
    this.configService.set('NOTES', [...notes, newNote]);
    return newNote;
  }

  findAll() {
    const notes = this.configService.get('NOTES') || [];
    return [notes, notes.length];
  }

  findOne(id: string) {
    const notes = this.configService.get('NOTES') || [];

    const note = notes.find((note) => note.id === id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  update(id: string, updateNoteDto: NoteHttpPutReqDto) {
    const note = this.findOne(id);

    if (updateNoteDto.title) {
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content) {
      note.content = updateNoteDto.content;
    }

    this.configService.set(
      'NOTES',
      this.configService
        .get('NOTES')
        .map((note) => (note.id === id ? note : note)),
    );

    return note;
  }

  remove(id: string) {
    const note = this.findOne(id);
    this.configService.set(
      'NOTES',
      this.configService.get('NOTES').filter((note) => note.id !== id),
    );
    return note;
  }
}
