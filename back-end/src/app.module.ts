import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { GrammarModule } from './grammar/grammar.module';
import { TopicModule } from './topic/topic.module';
import { ToeicTestModule } from './toeic_test/toeic_test.module';
import { UserAnswerModule } from './user_answer/user_answer.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/toeic-practice'), UserModule, QuestionModule, VocabularyModule, GrammarModule, TopicModule, ToeicTestModule, UserAnswerModule],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
