import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

@Schema()
export class User_Answer extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Toeic_Test' })
  test_id: string;

  @Prop({
    type: [
      { question_id: MongooseSchema.Types.ObjectId, selected_option: String },
    ],
  })
  answers: { question_id: string; selected_option: string }[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const UserAnswerSchema = SchemaFactory.createForClass(User_Answer);
