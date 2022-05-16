import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { WordLength } from "decorators/wordLength.decorator";

export class CreateUnitRequest {
  @WordLength(1)
  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
