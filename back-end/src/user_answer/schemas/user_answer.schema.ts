import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

@Schema()
export class User_Answer extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Toeic_Test' })
  toeic_test_id: string;

  @Prop({
    type: [
      {
        question_id: MongooseSchema.Types.ObjectId,
        selected_option: String,
        status: {
          type: String,
          enum: ['correct', 'incorrect', 'unanswered'],
          default: 'unanswered',
        },
      },
    ],
  })
  answers: { question_id: string; selected_option: string }[];
  @Prop({ default: 0 })
  correct_answers: number;
  @Prop({ default: 0 })
  incorrect_answers: number;
  @Prop({ default: 0 })
  unanswered_answers: number;

  @Prop({ default: Date.now })
  date_answer: Date;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const UserAnswerSchema = SchemaFactory.createForClass(User_Answer);
