import { Module } from '@nestjs/common';
import { UserAnswerService } from './user_answer.service';
import { UserAnswerController } from './user_answer.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User_Answer, UserAnswerSchema } from './schemas/user_answer.schema';
import { Question } from 'src/question/schemas/question.schema';
import { QuestionService } from 'src/question/question.service';
import { QuestionModule } from 'src/question/question.module';
import { ToeicTestModule } from 'src/toeic_test/toeic_test.module';
import { TestExpiredGateway } from 'src/user_answer/gateways/test_expired.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User_Answer.name, schema: UserAnswerSchema },
    ]),
    QuestionModule,
    ToeicTestModule,
  ],
  controllers: [UserAnswerController],
  providers: [UserAnswerService, TestExpiredGateway],
  exports: [UserAnswerService],
})
export class UserAnswerModule {}
