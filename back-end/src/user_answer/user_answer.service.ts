import { Injectable, Req } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User_Answer } from './schemas/user_answer.schema';
import { QuestionService } from 'src/question/question.service';
import { ToeicTestService } from 'src/toeic_test/toeic_test.service';
import { paginate } from 'src/common/pagination/pagination.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { read } from 'fs';

const STATUS_CORRECT = 'correct';
const STATUS_INCORRECT = 'incorrect';
const STATUS_UNANSWERED = 'unanswered';
const LISTENING_SECTION = 'listening';
const READING_SECTION = 'reading';

@Injectable()
export class UserAnswerService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly toeicTestService: ToeicTestService,
    @InjectModel(User_Answer.name) private userAnswerModel: Model<User_Answer>,
  ) {}

  async create(user_id: string, createUserAnswerDto: CreateUserAnswerDto) {
    let listening = 0;
    let reading = 0;
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

      // compare actual answer with user answer
      if (!answer.selected_option) {
        answer.status = STATUS_UNANSWERED;
      } else if (
        question &&
        question.correct_answer.includes(answer.selected_option)
      ) {
        // check question section
        if (question.section === LISTENING_SECTION) {
          listening += 1;
        } else if (question.section === READING_SECTION) {
          reading += 1;
        }
        answer.status = STATUS_CORRECT;
        createUserAnswerDto.correct_answers += 1;
      } else {
        answer.status = STATUS_INCORRECT;
        createUserAnswerDto.incorrect_answers += 1;
      }
    }
    //update unanswered_answers
    createUserAnswerDto.unanswered_answers =
      total_of_question -
      (createUserAnswerDto.correct_answers +
        createUserAnswerDto.incorrect_answers);

    createUserAnswerDto.user_id = user_id;

    const { listeningScore, readingScore } = this.calculateScore({
      correctListening: listening,
      correctReading: reading,
    });

    createUserAnswerDto.listening_score = listeningScore;
    createUserAnswerDto.reading_score = readingScore;
    createUserAnswerDto.total_score = listeningScore + readingScore;

    const new_user_answer = new this.userAnswerModel(createUserAnswerDto);
    await new_user_answer.save();
    return new_user_answer.populate({
      path: 'answers.question_id',
      model: 'Question',
      // populate: {
      //   path: 'passage_id',
      //   model: 'Passage',
      // },
    });
  }

  async findAllByUserId(user_id: string, paginationDto: PaginationDto) {
    // const user_answers = await this.userAnswerModel.find({ user_id: user_id });
    const filter = { user_id: user_id }; // Điều kiện lọc theo user_id
    const projection = {}; // Có thể chỉ định các trường cần lấy nếu muốn

    // Gọi hàm paginate và truyền vào model, DTO phân trang, điều kiện lọc, và projection
    const user_answers = await paginate(
      this.userAnswerModel, // Model MongoDB
      paginationDto, // Thông tin phân trang
      filter, // Điều kiện lọc theo user_id
      projection, // Lấy toàn bộ các trường, có thể điều chỉnh nếu cần
    );
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

  calculateScore({ correctListening, correctReading }) {
    const listeningScore = correctListening > 0 ? correctListening * 5 + 10 : 5;
    const readingScore = correctReading > 0 ? correctReading * 5 - 5 : 5;
    return { listeningScore, readingScore };
  }
}
