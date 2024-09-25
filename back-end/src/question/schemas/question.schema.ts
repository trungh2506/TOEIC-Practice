import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  question_number: number;

  @Prop({ required: true })
  question_text: string;

  @Prop({ type: [String], default: [] })
  question_images: string[];

  @Prop({ default: null })
  question_audio_url: string;

  @Prop({ required: true })
  part: number;

  @Prop({ required: true })
  section: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correct_answer: string;

  @Prop({ default: null })
  script: string;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
