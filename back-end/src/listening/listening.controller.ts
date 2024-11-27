import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { ListeningService } from './listening.service';
import { CreateListeningDto } from './dto/create-listening.dto';
import { UpdateListeningDto } from './dto/update-listening.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('listening')
export class ListeningController {
  constructor(private readonly listeningService: ListeningService) {}

  @Roles(Role.Admin)
  @Post()
  create(
    @Req() req: Request,
    @Body() createListeningDto: CreateListeningDto,
    @UploadedFiles()
    files: {
      audio: Express.Multer.File;
    },
  ) {
    const { questions, title, description, original_conversation } =
      createListeningDto;
    return this.listeningService.create(
      title,
      description,
      original_conversation,
      questions,
      files,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.listeningService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listeningService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListeningDto: UpdateListeningDto,
  ) {
    return this.listeningService.update(id, updateListeningDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listeningService.remove(id);
  }
}
