import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User_Answer } from './schemas/user_answer.schema';
import { QuestionService } from 'src/question/question.service';
import { ToeicTestService } from 'src/toeic_test/toeic_test.service';

@Injectable()
export class UserAnswerService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly toeicTestService: ToeicTestService,
    @InjectModel(User_Answer.name) private userAnswerModel: Model<User_Answer>,
  ) {}

  async create(createUserAnswerDto: CreateUserAnswerDto) {
    //get total question in toeic test id
    const total_of_question = await this.toeicTestService.getTotalQuestion(
      createUserAnswerDto.toeic_test_id,
    );
    createUserAnswerDto.correct_answers =
      createUserAnswerDto.correct_answers || 0;
    createUserAnswerDto.incorrect_answers =
      createUserAnswerDto.incorrect_answers || 0;
    createUserAnswerDto.unanswered_answers = total_of_question;
    const answers = createUserAnswerDto.answers;
    for (const answer of answers) {
      const question = await this.questionService.findOne(answer.question_id);
      if (!answer.selected_option) {
        answer.status = 'unanswered';
      } else if (
        question &&
        question.correct_answer.includes(answer.selected_option)
      ) {
        answer.status = 'correct';
        createUserAnswerDto.correct_answers += 1;
      } else {
        answer.status = 'incorrect';
        createUserAnswerDto.incorrect_answers += 1;
      }
    }
    //update unanswered_answers
    createUserAnswerDto.unanswered_answers =
      total_of_question -
      (createUserAnswerDto.correct_answers +
        createUserAnswerDto.incorrect_answers);

    const new_user_answer = new this.userAnswerModel(createUserAnswerDto);
    await new_user_answer.save();
    return new_user_answer;
  }

  async findAllByUserId(user_id: string) {
    const user_answers = await this.userAnswerModel.find({ user_id: user_id });
    return user_answers;
  }

  async findOneById(id: string) {
    const user_answer = await this.userAnswerModel.findById(id);
    return user_answer;
  }

  update(id: number, updateUserAnswerDto: UpdateUserAnswerDto) {
    return `This action updates a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
