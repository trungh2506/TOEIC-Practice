import { Injectable, NotFoundException, Req } from '@nestjs/common';
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
const TIME_DURATION_TEST = 120 * 60; // 2 tiếng

@Injectable()
export class UserAnswerService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly toeicTestService: ToeicTestService,
    private readonly testExpiredGateway: TestExpiredGateway,
    @InjectModel(User_Answer.name) private userAnswerModel: Model<User_Answer>,
  ) {}
  private userIntervals: { [userId: string]: NodeJS.Timeout } = {};

  //Pracetice Mode
  async create(user_id: string, createUserAnswerDto: CreateUserAnswerDto) {
    let listening = 0;
    let reading = 0;
    const total_of_question = await this.toeicTestService.getTotalPartQuestion(
      createUserAnswerDto.toeic_test_id,
      createUserAnswerDto.part,
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
    createUserAnswerDto.is_practice = true;
    createUserAnswerDto.status = 'completed';

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
    // Nếu có interval đang chạy, clear
    if (this.userIntervals[user_id]) {
      clearInterval(this.userIntervals[user_id]);
    }

    // Hủy các bài thi chưa hoàn thành
    const ongoingTest = await this.userAnswerModel.find({
      user_id: user_id,
      status: 'in_progress',
    });
    if (ongoingTest.length > 0) {
      return {
        message:
          'Bạn có một bài thi chưa hoàn thành. Bạn muốn tiếp tục bài thi cũ hay hủy và bắt đầu bài thi mới?',
        onGoingTest: ongoingTest,
      };
    }

    // Tạo mới bản ghi bắt đầu bài thi
    const newUserAnswer = new this.userAnswerModel({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      start_time: new Date().getTime(),
      end_time: new Date().getTime() + TIME_DURATION_TEST * 1000, // thời gian hết hạn (7200 giây)
      status: 'in_progress',
      unanswered_answers: 0,
    });

    // Lưu bản ghi bài thi
    await newUserAnswer.save();

    const end_time = newUserAnswer.end_time;

    // Kiểm tra thời gian còn lại mỗi giây
    const interval = setInterval(() => {
      const currentTime = new Date().getTime(); // Lấy thời gian hiện tại
      const remainingTime = Number(end_time) - Number(currentTime); // Tính thời gian còn lại
      if (remainingTime <= 0) {
        this.testExpiredGateway.notifyTestExpired(user_id);
        clearInterval(this.userIntervals[user_id]);
      } else if (remainingTime > 0) {
        // Vẫn còn thời gian
        let minutesRemaining = Math.floor(remainingTime / 60000); // Số phút còn lại
        let secondsRemaining = Math.floor((remainingTime % 60000) / 1000); // Số giây còn lại
        if (secondsRemaining === 0) {
          console.log(remainingTime);
          // In thời gian còn lại hoặc gửi thông báo mỗi giây nếu cần
          console.log(
            `Thời gian còn lại: ${minutesRemaining}:${secondsRemaining}`,
          );
          this.testExpiredGateway.notifyTimeRemaining(
            user_id,
            Math.floor(remainingTime / 1000),
          );
        }
      }
    }, 1000);
    // Kiểm tra mỗi giây

    // Lưu interval vào đối tượng cho người dùng này
    this.userIntervals[user_id] = interval;

    return {
      duration: TIME_DURATION_TEST,
    };
  }

  async resumeTest(user_id: string, toeic_test_id: string) {
    // Nếu có interval đang chạy, clear
    if (this.userIntervals[user_id]) {
      clearInterval(this.userIntervals[user_id]);
    }

    // Tìm bài thi đang làm
    const onGoingTest = await this.userAnswerModel.findOne({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      status: 'in_progress',
    });

    // Kiểm tra nếu không có bài thi đang tiếp tục
    if (!onGoingTest) {
      throw new Error('Không tìm thấy bài thi đang tiến hành.');
    }

    // Log thời gian lúc resume test
    console.log('THỜI GIAN LÚC RESUME TEST', onGoingTest.duration);

    // Cập nhật start_time và end_time
    onGoingTest.start_time = new Date();
    onGoingTest.end_time = new Date(
      new Date().getTime() + (TIME_DURATION_TEST - onGoingTest.duration) * 1000,
    );

    // Lưu bản ghi bài thi
    await onGoingTest.save();

    // Kiểm tra thời gian còn lại mỗi giây
    const interval = setInterval(() => {
      const currentTime = new Date().getTime(); // Lấy thời gian hiện tại
      const remainingTime = Number(onGoingTest.end_time) - Number(currentTime); // Tính thời gian còn lại

      if (remainingTime <= 0) {
        this.testExpiredGateway.notifyTestExpired(user_id);
        clearInterval(this.userIntervals[user_id]);
      } else if (remainingTime > 0) {
        let minutesRemaining = Math.floor(remainingTime / 60000); // Số phút còn lại
        let secondsRemaining = Math.floor((remainingTime % 60000) / 1000); // Số giây còn lại
        if (minutesRemaining % 1 === 0 && secondsRemaining === 0) {
          console.log(
            `Thời gian còn lại resume test: ${minutesRemaining}:${secondsRemaining}`,
          );
          this.testExpiredGateway.notifyTimeRemaining(
            user_id,
            Math.floor(remainingTime / 1000),
          );
        }
      }
    }, 1000); // Kiểm tra mỗi giây

    // Lưu interval vào đối tượng cho người dùng này
    this.userIntervals[user_id] = interval;

    //Trả về question_number đã làm
    const questionNumberList = [];
    for (const answer of onGoingTest.answers) {
      const question = await this.questionService.findOne(answer.question_id);

      questionNumberList.push(question.question_number);
    }
    console.log(questionNumberList);
    return {
      duration: TIME_DURATION_TEST - onGoingTest.duration,
      questionNumberList: questionNumberList,
    };
  }

  async submitTest(user_id: string, toeic_test_id: string, answers: any[]) {
    // Nếu có interval đang chạy, clear
    if (this.userIntervals[user_id]) {
      clearInterval(this.userIntervals[user_id]);
    }
    // Tìm bản ghi bài thi của người dùng
    const userAnswer = await this.userAnswerModel.findOne({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      status: 'in_progress', // Chỉ cho phép submit khi bài thi đang trong tiến trình
    });

    if (!userAnswer) {
      throw new Error('Bài thi không tồn tại hoặc đã bị hết thời gian.');
    }
    userAnswer.end_time = new Date(); // Cập nhật thời gian kết thúc bài thi
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
    console.log('thời gian làm bài lúc submit test1:', userAnswer.duration);
    userAnswer.duration += durationInSeconds;

    console.log('thời gian làm bài lúc submit test2:', durationInSeconds);

    // Tính điểm (giả sử bạn có hàm calculateScore để tính điểm)
    const { listeningScore, readingScore } = this.calculateScore({
      correctListening: listening,
      correctReading: reading,
    });

    userAnswer.listening_score = listeningScore;
    userAnswer.reading_score = readingScore;
    userAnswer.total_score = listeningScore + readingScore;

    // Cập nhật câu trả lời và trạng thái bài thi
    userAnswer.answers = answers; // Cập nhật danh sách câu trả lời của người dùng

    userAnswer.status = 'completed'; // Đánh dấu bài thi đã hoàn thành

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

  //Lưu bài thi tạm thời nếu người dùng reload
  async saveTempTest(user_id: string, toeic_test_id: string, answers: any[]) {
    // Nếu có interval đang chạy, clear
    if (this.userIntervals[user_id]) {
      clearInterval(this.userIntervals[user_id]);
    }
    // Tìm bản ghi bài thi của người dùng
    const userAnswer = await this.userAnswerModel.findOne({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      status: 'in_progress',
    });

    if (!userAnswer) {
      throw new Error('Bài thi không tồn tại hoặc đã bị hết thời gian.');
    }

    // Cập nhật câu trả lời và trạng thái bài thi
    userAnswer.answers = answers; // Cập nhật danh sách câu trả lời của người dùng
    userAnswer.end_time = new Date(); // Cập nhật thời gian kết thúc bài thi
    userAnswer.status = 'in_progress'; // Đánh dấu bài thi
    // Tính toán thời gian làm bài
    const durationInSeconds = Math.floor(
      (userAnswer.end_time.getTime() - userAnswer.start_time.getTime()) / 1000,
    );
    console.log('thời gian làm bài lúc save test:', durationInSeconds);
    userAnswer.duration += durationInSeconds;
    userAnswer.start_time = new Date();
    userAnswer.end_time = new Date(
      new Date().getTime() + (TIME_DURATION_TEST - durationInSeconds) * 1000,
    );
    // Lưu bản ghi đã cập nhật
    await userAnswer.save();

    return userAnswer.populate({
      path: 'answers.question_id',
      model: 'Question',
    });
  }

  async autoSaveTest(user_id: string, toeic_test_id: string, answers: any[]) {
    // Tìm bản ghi bài thi của người dùng
    const userAnswer = await this.userAnswerModel.findOne({
      user_id: user_id,
      toeic_test_id: toeic_test_id,
      status: 'in_progress',
    });

    if (!userAnswer) {
      throw new Error('Bài thi không tồn tại hoặc đã bị hết thời gian.');
    }

    // Cập nhật câu trả lời và trạng thái bài thi
    userAnswer.answers = answers; // Cập nhật danh sách câu trả lời của người dùng
    userAnswer.end_time = new Date(); // Cập nhật thời gian kết thúc bài thi
    userAnswer.status = 'in_progress'; // Đánh dấu bài thi
    // Tính toán thời gian làm bài
    const durationInSeconds = Math.floor(
      (userAnswer.end_time.getTime() - userAnswer.start_time.getTime()) / 1000,
    );
    console.log('thời gian làm bài lúc auto save test:', durationInSeconds);
    userAnswer.duration += durationInSeconds;
    userAnswer.start_time = new Date();
    userAnswer.end_time = new Date(
      new Date().getTime() + (TIME_DURATION_TEST - durationInSeconds) * 1000,
    );
    // Lưu bản ghi đã cập nhật
    await userAnswer.save();

    return userAnswer.populate({
      path: 'answers.question_id',
      model: 'Question',
    });
  }

  async cancelTest(user_answer_id: string) {
    const result = await this.userAnswerModel.findByIdAndUpdate(
      user_answer_id,
      { status: 'canceled' },
      {
        new: true,
      },
    );
    if (!result) {
      throw new NotFoundException('Không tìm thấy Câu trả lời người dùng');
    }
    return result;
  }

  async findAllByUserId(user_id: string, paginationDto: PaginationDto) {
    // const user_answers = await this.userAnswerModel.find({ user_id: user_id });
    const filter = { user_id: user_id, status: 'completed' }; // Điều kiện lọc theo user_id
    const projection = {}; // Có thể chỉ định các trường cần lấy nếu muốn
    const populate = [
      { path: 'toeic_test_id', select: 'title description' }, // Lấy trường title và description từ toeic_test_id
    ];
    const sort = { date_answer: -1 };
    // Gọi hàm paginate và truyền vào model, DTO phân trang, điều kiện lọc, và projection
    const user_answers = await paginate(
      this.userAnswerModel, // Model MongoDB
      paginationDto, // Thông tin phân trang
      filter, // Điều kiện lọc theo user_id
      projection,
      populate,
      sort,
    );
    return user_answers;
  }

  async findAllByUserIdWithOutPagination(user_id: string) {
    const result = await this.userAnswerModel.find({ user_id: user_id });
    return result;
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
