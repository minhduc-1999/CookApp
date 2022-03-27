import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IInteractiveRequest } from "base/dtos/interfaces/interactableRequest.interface";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { InteractiveTargetType } from "enums/social.enum";

export class CreateCommentRequest implements IInteractiveRequest {
  @ApiProperty({ type: String })
  @IsUUID()
  targetId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  content: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  replyFor: string;

  @ApiProperty({ enum: InteractiveTargetType })
  @IsEnum(InteractiveTargetType)
  targetType: InteractiveTargetType

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  images?: string[];
}
