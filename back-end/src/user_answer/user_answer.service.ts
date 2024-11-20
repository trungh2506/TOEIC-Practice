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
import { TestExpiredGateway } from 'src/user_answer/gateways/test_expired.gateway';

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
    private readonly testExpiredGateway: TestExpiredGateway,
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

  async startTest(user_id: string, toeic_test_id: string) {
    const newUserAnswer = new this.userAnswerModel({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      start_time: new Date(),
      status: 'in_progress',
      unanswered_answers: 0,
    });

    await newUserAnswer.save();

    return newUserAnswer;
  }

  async submitTest(user_id: string, toeic_test_id: string, answers: any[]) {
    // Tìm bản ghi bài thi của người dùng
    const userAnswer = await this.userAnswerModel.findOne({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      status: 'in_progress', // Chỉ cho phép submit khi bài thi đang trong tiến trình
    });

    // Cập nhật câu trả lời và trạng thái bài thi
    userAnswer.answers = answers; // Cập nhật danh sách câu trả lời của người dùng
    userAnswer.end_time = new Date(); // Cập nhật thời gian kết thúc bài thi
    userAnswer.status = 'completed'; // Đánh dấu bài thi đã hoàn thành

    if (!userAnswer) {
      throw new Error('Bài thi không tồn tại hoặc đã bị hết thời gian.');
    }

    let listening = 0;
    let reading = 0;
    const total_of_question =
      await this.toeicTestService.getTotalQuestion(toeic_test_id);

    let correct_answers = 0; // Biến để lưu số câu trả lời đúng
    let incorrect_answers = 0; // Biến để lưu số câu trả lời sai

    // Lặp qua từng câu trả lời của người dùng
    for (const answer of answers) {
      const question = await this.questionService.findOne(answer.question_id);
      if (!question) {
        throw new Error(`Câu hỏi với ID ${answer.question_id} không tồn tại.`);
      }
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
        correct_answers += 1;
      } else {
        answer.status = STATUS_INCORRECT;
        incorrect_answers += 1;
      }
    }

    // Cập nhật số câu trả lời đúng, sai và chưa trả lời
    userAnswer.correct_answers = correct_answers;
    userAnswer.incorrect_answers = incorrect_answers;
    userAnswer.unanswered_answers =
      total_of_question - (correct_answers + incorrect_answers);

    // Tính toán thời gian làm bài
    const durationInSeconds = Math.floor(
      (userAnswer.end_time.getTime() - userAnswer.start_time.getTime()) / 1000,
    );
    userAnswer.duration = durationInSeconds;

    // Tính điểm (giả sử bạn có hàm calculateScore để tính điểm)
    const { listeningScore, readingScore } = this.calculateScore({
      correctListening: listening,
      correctReading: reading,
    });

    userAnswer.listening_score = listeningScore;
    userAnswer.reading_score = readingScore;
    userAnswer.total_score = listeningScore + readingScore;

    // Lưu bản ghi đã cập nhật
    await userAnswer.save();

    // return {
    //   status: userAnswer.status,
    //   total_score: userAnswer.total_score,
    //   listening_score: userAnswer.listening_score,
    //   reading_score: userAnswer.reading_score,
    //   duration: userAnswer.duration,
    //   answers: userAnswer.answers,
    // };
    return userAnswer.populate({
      path: 'answers.question_id',
      model: 'Question',
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
