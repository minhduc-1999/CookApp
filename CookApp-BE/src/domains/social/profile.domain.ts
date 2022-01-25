import { ApiPropertyOptional } from "@nestjs/swagger";
import { Sex } from "enums/sex.enum";

export class Profile {
  @ApiPropertyOptional({ type: Number, default: 170 })
  height?: number;

  @ApiPropertyOptional({ type: Number, default: 40 })
  weight?: number;

  @ApiPropertyOptional({ type: Number, example: new Date().getTime() })
  birthDate?: number;

  @ApiPropertyOptional({ type: String })
  firstName?: string;

  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @ApiPropertyOptional({ enum: Sex })
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
