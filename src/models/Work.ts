import { Document } from "mongoose";
import { prop, Typegoose, ModelType, InstanceType, Ref } from "typegoose";

import { User } from "models/User";

class Work extends Typegoose {
  @prop()
  id: number;

  @prop()
  type: string;

  @prop()
  description: string;

  @prop()
  location: string;

  @prop()
  time: Date;

  @prop()
  status: string;

  @prop()
  expectedSalary: string;

  @prop({ ref: User, required: true })
  owner: Ref<User>;

  @prop({ ref: User, required: true })
  helper: Ref<User>;
}

export { Work };
