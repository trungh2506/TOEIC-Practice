import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Question } from '../../question/schemas/question.schema'; // Assuming you already have a Question schema

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Passage } from 'src/passage/schemas/passage.schema';

@Schema({ timestamps: true })
export class Toeic_Test extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  image: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Passage' }] })
  listening: Passage[];

  // Mảng các Passage cho phần Reading
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Passage' }] })
  reading: Passage[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  standalone_questions: Question[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const ToeicTestSchema = SchemaFactory.createForClass(Toeic_Test);
