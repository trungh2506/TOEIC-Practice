import { Module } from '@nestjs/common';
import { PassageService } from './passage.service';
import { PassageController } from './passage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Passage, PassageSchema } from './schemas/passage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Passage.name, schema: PassageSchema }]),
  ],
  controllers: [PassageController],
  providers: [PassageService],
  exports: [PassageService],
})
export class PassageModule {}
