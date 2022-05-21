import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordLength } from "decorators/wordLength.decorator";

export class CreateTopicRequest {
  @WordLength(1)
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"])
  cover: string;
}
