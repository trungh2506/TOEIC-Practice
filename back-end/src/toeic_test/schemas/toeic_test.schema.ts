import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Question } from '../../question/schemas/question.schema'; // Assuming you already have a Question schema

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Passage } from 'src/passage/schemas/passage.schema';
import { ToeicTestType } from 'src/enum/toeic-type.enum';

@Schema({ timestamps: true })
export class Toeic_Test extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  image: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  listening: Question[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  reading: Question[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Passage' }] })
  passages: Passage[];

  @Prop({ required: true, enum: ToeicTestType, default: ToeicTestType.FULL })
  type: ToeicTestType;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const ToeicTestSchema = SchemaFactory.createForClass(Toeic_Test);
