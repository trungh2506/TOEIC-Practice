import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { plainToClass } from 'class-transformer';

import * as XLSX from 'xlsx';

@Controller('toeic-test')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) {}

  @Public()
  // @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'questions', maxCount: 1 },
        { name: 'passages', maxCount: 1 },
        { name: 'images', maxCount: 100 },
        { name: 'audios', maxCount: 100 },
        { name: 'testImage', maxCount: 1 },
      ],
      { storage },
    ),
  )
  create(
    @Req() req: Request,
    @UploadedFiles()
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
    },
  ) {
    return this.toeicTestService.create(files);
  }

  @Get()
  findAll() {
    return this.toeicTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toeicTestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateToeicTestDto: UpdateToeicTestDto,
  ) {
    return this.toeicTestService.update(+id, updateToeicTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toeicTestService.remove(+id);
  }
}
