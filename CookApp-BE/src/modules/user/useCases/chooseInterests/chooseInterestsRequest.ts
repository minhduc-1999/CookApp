import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsUUID } from "class-validator";

export class ChooseInterestsRequest {
  @ApiProperty({ type: [String] })
  @IsUUID(4, { each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  topicIds: string[];
}
