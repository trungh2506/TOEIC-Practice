import { Module } from '@nestjs/common';
import { UserAnswerService } from './user_answer.service';
import { UserAnswerController } from './user_answer.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User_Answer, UserAnswerSchema } from './schemas/user_answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User_Answer.name, schema: UserAnswerSchema },
    ]),
  ],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
