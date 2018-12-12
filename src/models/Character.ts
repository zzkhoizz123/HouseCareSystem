import { Document } from "mongoose";
import { prop, Typegoose, ModelType, InstanceType, Ref } from "typegoose";

class Character extends Typegoose {
  @prop()
  type: string;

  @prop()
  description: string;
}

export { Character };
