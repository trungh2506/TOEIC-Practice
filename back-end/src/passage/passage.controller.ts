import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PassageService } from './passage.service';
import { CreatePassageDto } from './dto/create-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';

@Controller('passage')
export class PassageController {
  constructor(private readonly passageService: PassageService) {}

  @Post()
  create(@Body() createPassageDto: CreatePassageDto) {
    return this.passageService.create(createPassageDto);
  }

  @Get()
  findAll() {
    return this.passageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePassageDto: UpdatePassageDto) {
    return this.passageService.update(+id, updatePassageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passageService.remove(id);
  }
}
