import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';

import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Grammar extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const GrammarSchema = SchemaFactory.createForClass(Grammar);
