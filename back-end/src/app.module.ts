import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { GrammarModule } from './grammar/grammar.module';
import { TopicModule } from './topic/topic.module';
import { ToeicTestModule } from './toeic_test/toeic_test.module';
import { UserAnswerModule } from './user_answer/user_answer.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { MulterModule } from '@nestjs/platform-express';
import { PassageModule } from './passage/passage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DropboxModule } from './dropbox/dropbox.module';
import { StatisticsModule } from './statistics/statistics.module';
import multer from 'multer';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/toeic-practice'),
    ConfigModule.forRoot({
      isGlobal: true, // Để module này có thể được sử dụng ở mọi nơi trong dự án
    }),
    MulterModule.register({
      dest: './uploads', // Đường dẫn lưu trữ file mặc định
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    QuestionModule,
    VocabularyModule,
    GrammarModule,
    TopicModule,
    ToeicTestModule,
    UserAnswerModule,
    AuthModule,
    PassageModule,
    DropboxModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
