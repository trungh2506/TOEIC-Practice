import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Question } from '../../question/schemas/question.schema';
import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

export class Listening extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  original_conversation: string;

  @Prop()
  modify_conversation: string;

  @Prop({ required: true })
  blank_words: string[];

  @Prop()
  audio: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const ListeningSchema = SchemaFactory.createForClass(Listening);
