import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ToeicTestService } from 'src/toeic_test/toeic_test.service';
import { PassageService } from 'src/passage/passage.service';
import { QuestionService } from 'src/question/question.service';
import { ToeicTestModule } from 'src/toeic_test/toeic_test.module';
import { UserAnswerModule } from 'src/user_answer/user_answer.module';
import { UserAnswerService } from 'src/user_answer/user_answer.service';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [ToeicTestModule, UserAnswerModule, QuestionModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
