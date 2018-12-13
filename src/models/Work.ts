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
  status: number;

  @prop()
  expectedSalary: string;

  @prop({ ref: User, required: false })
  owner: Ref<User>;

  @prop({ ref: User, required: false })
  helper: Ref<User>;
}

export { Work };
