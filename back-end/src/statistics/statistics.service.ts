import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { ToeicTestService } from 'src/toeic_test/toeic_test.service';
import { UserAnswerService } from 'src/user_answer/user_answer.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly toeicTestService: ToeicTestService,
    private readonly useAnswerService: UserAnswerService,
    private readonly questionService: QuestionService,
  ) {}

  findAll() {
    return `This action returns all statistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} statistic`;
  }

  async statUser(user_id: string) {
    const allPart = [
      {
        part: 1,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Mô Tả Hình Ảnh',
      },
      {
        part: 2,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Hỏi Và Trả Lời',
      },
      {
        part: 3,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Đoạn Hội Thoại',
      },
      {
        part: 4,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Bài Nói Chuyện',
      },
      {
        part: 5,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Hoàn thành câu',
      },
      {
        part: 6,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Hoàn Thành Đoạn Văn',
      },
      {
        part: 7,
        corrects: 0,
        incorrects: 0,
        unanswers: 0,
        description: 'Đọc Hiểu',
      },
    ];
    const allUserAnswer =
      await this.useAnswerService.findAllByUserIdWithOutPagination(user_id);
    if (!allUserAnswer && allUserAnswer.length <= 0) {
      return {
        success: false,
        message: 'Người dùng chưa thực hiện bài thi hoặc luyện tập nào!.',
      };
    }

    //Duyệt qua từng user answer của người dùng
    for (const userAnswer of allUserAnswer) {
      const answers = userAnswer.answers;

      //Duyệt qua từng answer trong 1 user answer
      for (const answer of answers) {
        //Nếu user answer đó có trường part tức là đang luyện tập
        if (userAnswer.part)
          allPart[userAnswer.part - 1].unanswers =
            userAnswer.unanswered_answers;

        //Lấy ra question trong answer
        const question = await this.questionService.findOne(answer.question_id);

        //Kiểm tra đáp án người dùng
        //Nếu chưa trả lời
        if (!answer.selected_option) {
          allPart[question.part - 1].unanswers += 1;

          //Nếu trả lời đúng
        } else if (question.correct_answer.includes(answer.selected_option)) {
          allPart[question.part - 1].corrects += 1;
        } else {
          allPart[question.part - 1].incorrects += 1;
        }
      }
    }
    return {
      success: true,
      allPart: allPart,
      message: 'Thống kê người dùng',
    };
  }
}
