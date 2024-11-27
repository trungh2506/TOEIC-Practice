import { Module } from '@nestjs/common';
import { ListeningService } from './listening.service';
import { ListeningController } from './listening.controller';
import { QuestionModule } from 'src/question/question.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Listening,
  ListeningSchema,
} from 'src/listening/schemas/listening.schema';
import { DropboxModule } from 'src/dropbox/dropbox.module';

@Module({
  controllers: [ListeningController],
  providers: [ListeningService, ListeningModule],
  imports: [
    MongooseModule.forFeature([
      { name: Listening.name, schema: ListeningSchema },
    ]),
    DropboxModule,
  ],
})
export class ListeningModule {}
