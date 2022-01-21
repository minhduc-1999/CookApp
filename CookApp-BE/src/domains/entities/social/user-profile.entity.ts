import { ProfileDTO } from "dtos/social/profile.dto";
import { Sex } from "enums/sex.enum";

export class UserProfile {

  height: number;

  weight: number;

  sex: Sex;

  firstName: string;

  lastName: string;

  birthDate: number;

  fullName: string;

  constructor(profile: Partial<ProfileDTO>) {
    this.height = profile?.height
    this.weight = profile?.weight
    this.sex = profile?.sex
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.birthDate = profile?.birthDate
  }
}
