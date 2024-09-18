import { Injectable } from '@nestjs/common';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Toeic_Test } from './schemas/toeic_test.schema';

@Injectable()
export class ToeicTestService {
  constructor(
    @InjectModel(Toeic_Test.name) private toeicTestModel: Model<Toeic_Test>,
  ) {}

  create(createToeicTestDto: CreateToeicTestDto) {
    return 'This action adds a new toeicTest';
  }

  findAll() {
    return `This action returns all toeicTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toeicTest`;
  }

  update(id: number, updateToeicTestDto: UpdateToeicTestDto) {
    return `This action updates a #${id} toeicTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} toeicTest`;
  }
}
