import { Document } from "mongoose";
import { prop, Typegoose, ModelType, InstanceType, Ref } from "typegoose";

import { Character } from "models/Character";
import { Work } from "models/Work";

class Property extends Typegoose {
  @prop()
  id: number;

  @prop()
  location: string;

  @prop({ ref: Character })
  character: Ref<Character>;

  @prop({ ref: Work })
  work: Ref<Work>;
}

export { Property };
