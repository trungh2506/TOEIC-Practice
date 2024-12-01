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
  Query,
} from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage, storageMemory } from 'src/config/storage.config';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { plainToClass } from 'class-transformer';

import * as XLSX from 'xlsx';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Controller('toeic-test')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) {}

  // @Public()
  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'questions', maxCount: 1 },
        { name: 'passages', maxCount: 1 },
        { name: 'images', maxCount: 100 },
        { name: 'audios', maxCount: 100 },
        { name: 'testImage', maxCount: 1 },
        { name: 'fullAudio', maxCount: 1 },
      ],
      // { storageMemory },
    ),
  )
  create(
    @Req() req: Request,
    @Body() body: CreateToeicTestDto,
    @UploadedFiles()
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
      fullAudio?: Express.Multer.File;
    },
  ) {
    const toeic_test_title = body.title;
    const toeic_test_type = body.type;
    return this.toeicTestService.create(
      files,
      toeic_test_title,
      toeic_test_type,
    );
  }

  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.toeicTestService.findAll(paginationDto);
  }

  @Roles(Role.Admin)
  @Get('admin')
  adminfindAll(@Query() paginationDto: PaginationDto) {
    return this.toeicTestService.adminFindAll(paginationDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toeicTestService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'questions', maxCount: 1 },
        { name: 'passages', maxCount: 1 },
        { name: 'images', maxCount: 100 },
        { name: 'audios', maxCount: 100 },
        { name: 'testImage', maxCount: 1 },
        { name: 'fullAudio', maxCount: 1 },
      ],
      // { storageMemory },
    ),
  )
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateToeicTestDto,
    @UploadedFiles()
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
      fullAudio?: Express.Multer.File;
    },
  ) {
    const toeic_test_title = body.title;
    const toeic_test_type = body.type;
    return this.toeicTestService.update(
      id,
      files,
      toeic_test_title,
      toeic_test_type,
    );
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toeicTestService.remove(id);
  }

  @Public()
  @Get(':testId/part/:partNumber')
  async getPart(
    @Param('testId') testId: string,
    @Param('partNumber') partNumber: number,
  ) {
    return this.toeicTestService.getPart(testId, partNumber);
  }

  @Roles(Role.Admin)
  @Patch('restore/:id')
  restoreAfterSoftDelete(@Param('id') toeic_test_id: string) {
    return this.toeicTestService.restoreAfterSoftDelete(toeic_test_id);
  }
}
