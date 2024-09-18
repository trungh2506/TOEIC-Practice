import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User_Answer } from './schemas/user_answer.schema';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectModel(User_Answer.name) private userAnswerModel: Model<User_Answer>,
  ) {}

  create(createUserAnswerDto: CreateUserAnswerDto) {
    return 'This action adds a new userAnswer';
  }

  findAll() {
    return `This action returns all userAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAnswer`;
  }

  update(id: number, updateUserAnswerDto: UpdateUserAnswerDto) {
    return `This action updates a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
