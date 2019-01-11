import { Document } from "mongoose";
import { prop, Typegoose, ModelType, InstanceType, Ref } from "typegoose";

import { Work } from "models/Work";

class User extends Typegoose {
  @prop()
  id: number;

  @prop()
  username: string;

  @prop()
  password: string;

  @prop()
  email: string;

  @prop()
  name: string;

  @prop()
  sex: string;

  @prop()
  salt: string;

  @prop()
  role: number;

  @prop()
  character: object;

  @prop()
  profile: object;

  @prop()
  property: object;

  @prop()
  address: string;

  @prop({ ref: Work })
  workingList: Array<Ref<Work>>;

  @prop()
  walletAddress: string
}

export { User };
