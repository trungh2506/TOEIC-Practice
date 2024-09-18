import { Module } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { GrammarController } from './grammar.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Grammar, GrammarSchema } from './schemas/grammar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Grammar.name, schema: GrammarSchema }])
  ],
  controllers: [GrammarController],
  providers: [GrammarService],
})
export class GrammarModule {}
