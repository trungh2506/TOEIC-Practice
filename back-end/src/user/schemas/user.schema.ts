import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Vocabulary } from 'src/vocabulary/schemas/vocabulary.schema';
import { Question } from 'src/question/schemas/question.schema';

import { MetaData, MetaDataSchema } from 'src/common/meta_data.schema';
import { Role } from 'src/enum/role.enum';

import { Exclude, Expose } from 'class-transformer';

@Schema({ timestamps: true }) // created_at & updated_at was automacally created
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  dob: Date;

  @Prop({ required: true, enum: Role, default: Role.User })
  roles: Role;

  @Prop()
  fullname: string;

  @Prop()
  number_phone: string;

  @Prop()
  estimate_scores: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Vocabulary' }] })
  saved_vocabulary: Vocabulary[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  favorites: Question[];

  @Prop()
  avatar: string;
  @Prop()
  google_id: string;
  @Prop()
  facebook_id: string;

  @Prop({ type: MetaDataSchema, default: () => ({}) })
  meta_data: MetaData;
}

export const UserSchema = SchemaFactory.createForClass(User);
