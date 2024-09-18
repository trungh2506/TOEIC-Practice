import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vocabulary } from './schemas/vocabulary.schema';
@Injectable()
export class VocabularyService {
  constructor(@InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>) {}

  create(createVocabularyDto: CreateVocabularyDto) {
    return 'This action adds a new vocabulary';
  }

  findAll() {
    return `This action returns all vocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }
}
