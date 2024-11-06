import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Question } from 'src/question/schemas/question.schema';

@Schema()
export class Passage extends Document {
  @Prop({ required: true })
  id: string;

  @Prop()
  title: string;

  @Prop()
  instructions: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  part: number;

  @Prop({ default: null })
  audio: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [Number] })
  questions: number[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const PassageSchema = SchemaFactory.createForClass(Passage);
