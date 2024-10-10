import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Question } from 'src/question/schemas/question.schema';

@Schema()
export class Passage extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  instructions: string;

  @Prop()
  content: string;

  @Prop({ default: null })
  audio: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const PassageSchema = SchemaFactory.createForClass(Passage);
