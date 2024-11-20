import { Module } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { ToeicTestController } from './toeic_test.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Toeic_Test, ToeicTestSchema } from './schemas/toeic_test.schema';
import { PassageService } from 'src/passage/passage.service';
import { PassageModule } from 'src/passage/passage.module';
import { QuestionModule } from 'src/question/question.module';
import { DropboxModule } from 'src/dropbox/dropbox.module';
import { UploadGateway } from 'src/toeic_test/gateways/upload.gateway';
import { Question } from 'src/question/schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Toeic_Test.name, schema: ToeicTestSchema },
    ]),
    PassageModule,
    QuestionModule,
    DropboxModule,
  ],
  controllers: [ToeicTestController],
  providers: [ToeicTestService, UploadGateway],
  exports: [ToeicTestService],
})
export class ToeicTestModule {}
