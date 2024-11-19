import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  findAll() {
    return `This action returns all question`;
  }

  async findOne(question_id: string) {
    const question = await this.questionModel.findById(question_id);
    return question;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: string) {
    return await this.questionModel.findByIdAndDelete(id);
  }
}
