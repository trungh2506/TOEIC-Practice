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
import { storage } from 'src/config/storage.config';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { plainToClass } from 'class-transformer';

import * as XLSX from 'xlsx';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

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
    @Body() body: any,
    @UploadedFiles()
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
    },
  ) {
    const toeic_test_title = body.title;
    const toeic_test_type = body.type;
    console.log('aaaa', files.testImage);
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

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toeicTestService.findOne(id);
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

  @Public()
  @Get(':testId/part/:partNumber')
  async getPart(
    @Param('testId') testId: string,
    @Param('partNumber') partNumber: number,
  ) {
    return this.toeicTestService.getPart(testId, partNumber);
  }
}
