import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Passage } from 'src/passage/schemas/passage.schema';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  question_number: number;

  @Prop()
  question_text: string;

  @Prop()
  question_image: string;

  @Prop({ default: null })
  question_audio: string;

  @Prop({ required: true })
  part: number;

  @Prop({ required: true })
  section: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correct_answer: string;

  @Prop({ type: String, ref: 'Passage' })
  passage_id: String;

  @Prop({ default: null })
  script: string;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
