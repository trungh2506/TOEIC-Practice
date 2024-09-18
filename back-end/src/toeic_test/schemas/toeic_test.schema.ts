import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question } from '../../question/schemas/question.schema'; // Assuming you already have a Question schema

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

@Schema({ timestamps: true })
export class Toeic_Test extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [{ type: String, ref: 'Question' }] }) // Array of Question IDs for listening part
  listening: Question[];

  @Prop({ type: [{ type: String, ref: 'Question' }] }) // Array of Question IDs for reading part
  reading: Question[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const ToeicTestSchema = SchemaFactory.createForClass(Toeic_Test);
