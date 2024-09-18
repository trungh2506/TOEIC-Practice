import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class MetaData extends Document {
  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: String })
  created_by: string;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: String })
  updated_by: string;

  @Prop({ type: String })
  deleted_by: string;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;
}

export const MetaDataSchema = SchemaFactory.createForClass(MetaData);