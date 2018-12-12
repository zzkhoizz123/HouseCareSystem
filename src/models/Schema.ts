import bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  username: { type: String, index: true, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  name: { type: String },
  sex: { type: String },
  salt: { type: String },
  role: { type: Number }, // either helper or owner (1, 0)
  character: { type: Schema.Types.ObjectId, ref: "Character" },
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
  property: { type: Schema.Types.ObjectId, ref: "Property" },
  workingList: [{ type: Schema.Types.ObjectId, ref: "Work" }]
});

const WorkSchema = new Schema({
  id: Schema.Types.ObjectId,
  type: [
    {
      type: String
    }
  ],
  description: { type: String },
  location: {
    type: String
  },
  time: {
    type: Date, // String to date
    default: Date.now
  },
  status: { type: String },
  expectedSalary: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  helper: { type: Schema.Types.ObjectId, ref: "User" }
});

const CharacterSchema = new Schema({
  type: [
    {
      type: String
    }
  ],
  description: { type: String }
});

const PropertySchema = new Schema({
  id: Schema.Types.ObjectId,
  location: {
    type: String
  },
  character: { type: Schema.Types.ObjectId, ref: "Character" },
  work: { type: Schema.Types.ObjectId, ref: "Work" }
});

const ProfileSchema = new Schema({
  id: Schema.Types.ObjectId,
  picture: { type: String },
  experience: { type: String },
  level: { type: String },
  introducedBy: { type: String },
  previousJob: { type: String }
});

const User = model("User", UserSchema);
const Work = model("Work", UserSchema);
const Character = model("Character", UserSchema);
const Property = model("Property", UserSchema);
const Profile = model("Profile", UserSchema);

export { User, Work, Character, Property, Profile };
