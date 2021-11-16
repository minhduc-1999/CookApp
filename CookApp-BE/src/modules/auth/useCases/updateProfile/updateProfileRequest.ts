import { PartialType } from "@nestjs/swagger";
import { ProfileDTO } from "dtos/profile.dto";

export class UpdateProfileRequest extends PartialType(ProfileDTO) {}
