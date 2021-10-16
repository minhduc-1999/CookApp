import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Sex, SexEnum } from "enums/sex.enum";
import { ProfileDTO } from "modules/auth/dtos/profile.dto";
import { Document } from "mongoose";

export type UserProfileDocument = UserProfile & Document;

@Schema()
export class UserProfile extends AbstractSchema {

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop({enum: SexEnum })
  sex: Sex;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: number;

  fullName: string;

  constructor(profile: Partial<ProfileDTO>) {
    super(profile)
    this.height = profile?.height
    this.weight = profile?.weight
    this.sex = profile?.sex
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.birthDate = profile?.birthDate
  }
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

UserProfileSchema.virtual('fullName').get(function (this: UserProfileDocument) {
  return `${this.firstName ? this.firstName: ''} ${this.lastName ? this.lastName : ''}`.trim()
})

export const UserProfileModel: ModelDefinition = {
  name: UserProfile.name,
  schema: UserProfileSchema,
};