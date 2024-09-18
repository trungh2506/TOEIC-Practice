import { Injectable } from '@nestjs/common';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Grammar } from './schemas/grammar.schema';
import { Model } from 'mongoose';


@Injectable()
export class GrammarService {
  constructor(@InjectModel(Grammar.name) private grammarModel: Model<Grammar>) {}

  create(createGrammarDto: CreateGrammarDto) {
    return 'This action adds a new grammar';
  }

  findAll() {
    return `This action returns all grammar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grammar`;
  }

  update(id: number, updateGrammarDto: UpdateGrammarDto) {
    return `This action updates a #${id} grammar`;
  }

  remove(id: number) {
    return `This action removes a #${id} grammar`;
  }
}
