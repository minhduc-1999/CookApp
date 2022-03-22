import { Sex } from "enums/sex.enum";

export class Profile {
  height?: number;

  weight?: number;

  birthDate?: number;

  firstName?: string;

  lastName?: string;

  sex?: Sex;
  
  constructor(profile?: Partial<Profile>) {
    this.birthDate = profile?.birthDate
    this.height = profile?.height
    this.weight = profile?.weight
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.sex = profile?.sex
  }
}
