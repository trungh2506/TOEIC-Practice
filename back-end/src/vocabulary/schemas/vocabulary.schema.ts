import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
 
import {Topic} from "../../topic/schemas/topic.schema"

import { MetaData, MetaDataSchema  } from 'src/common/meta_data.schema';


@Schema({ timestamps: true })
export class Vocabulary extends Document {
  
  @Prop({ required: true })
  word: string;

  @Prop()
  audio_url: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Topic' })
  topic: Topic; 
  
  @Prop({ required: true })
  definition: string;

  @Prop()
  part_of_speech: string;

  @Prop({ type: [String] })
  examples: string[];

  @Prop()
  pronunciation: string;

  @Prop({ type: [String] })
  synonyms: string[];

  @Prop({ type: [String] })
  antonyms: string[];

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);