import { PartialType } from "@nestjs/swagger";
import { ProfileDTO } from "modules/auth/dtos/profile.dto";

export class UpdateProfileRequest extends PartialType(ProfileDTO) {}
