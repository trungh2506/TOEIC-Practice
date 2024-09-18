import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';

@Controller('toeic-test')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) {}

  @Post()
  create(@Body() createToeicTestDto: CreateToeicTestDto) {
    return this.toeicTestService.create(createToeicTestDto);
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
  update(@Param('id') id: string, @Body() updateToeicTestDto: UpdateToeicTestDto) {
    return this.toeicTestService.update(+id, updateToeicTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toeicTestService.remove(+id);
  }
}
