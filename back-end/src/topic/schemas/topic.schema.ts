import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

import { MetaData, MetaDataSchema  } from 'src/common/meta_data.schema';

@Schema({ timestamps: true })  // This adds createdAt and updatedAt fields automatically
export class Topic extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 0 })
  total: number;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);