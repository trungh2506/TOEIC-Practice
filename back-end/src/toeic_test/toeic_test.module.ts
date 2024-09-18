import { Module } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { ToeicTestController } from './toeic_test.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Toeic_Test, ToeicTestSchema } from './schemas/toeic_test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Toeic_Test.name, schema: ToeicTestSchema },
    ]),
  ],
  controllers: [ToeicTestController],
  providers: [ToeicTestService],
})
export class ToeicTestModule {}
