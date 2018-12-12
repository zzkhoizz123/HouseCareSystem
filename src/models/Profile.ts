import { Document } from "mongoose";
import { prop, Typegoose, ModelType, InstanceType, Ref } from "typegoose";

class Profile extends Typegoose {
  id: number;
  picture: string;
  experience: string;
  level: string;
  introducedBy: string;
  previousJob: string;
}

export { Profile };
