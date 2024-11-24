import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('user')
  async statUser(@Req() req) {
    const result = await this.statisticsService.statUser(req.user?._id);
    if (!result.success) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: result.message,
        },
        HttpStatus.CONFLICT,
      );
    }
    return {
      message: result.message,
      allPart: result.allPart,
    };
  }

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(+id);
  }
}
