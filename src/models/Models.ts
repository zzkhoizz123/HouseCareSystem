import { User } from "models/User";
import { Work } from "models/Work";
import { Character } from "models/Character";
import { Profile } from "models/Profile";
import { Property } from "models/Property";

const UserModel = new User().getModelForClass(User);
const WorkModel = new Work().getModelForClass(Work);
const ProfileModel = new Profile().getModelForClass(Profile);
const PropertyModel = new Property().getModelForClass(Property);
const CharacterModel = new Character().getModelForClass(Character);

export { UserModel, WorkModel, ProfileModel, PropertyModel, CharacterModel };
