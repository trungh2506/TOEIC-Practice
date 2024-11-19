import { Injectable } from '@nestjs/common';
import { CreatePassageDto } from './dto/create-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';
import { Passage } from './schemas/passage.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PassageService {
  constructor(
    @InjectModel(Passage.name) private passageModel: Model<Passage>,
  ) {}

  create(createPassageDto: CreatePassageDto) {
    const newPassage = new this.passageModel(createPassageDto);
    return newPassage.save();
  }

  findAll() {
    return `This action returns all passage`;
  }

  findOne(id: string) {
    return `This action returns a #${id} passage`;
  }

  update(id: number, updatePassageDto: UpdatePassageDto) {
    return `This action updates a #${id} passage`;
  }

  async remove(id: string) {
    return await this.passageModel.findByIdAndDelete(id);
  }
}
