import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { MessageContentType } from "enums/social.enum";

export class ImageContentRequest {
  @ApiProperty({ type: String })
  @IsString()
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"])
  @IsNotEmpty()
  image: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  height: number;
}

export class SendMessageRequest {
  @ApiProperty({ type: String })
  @IsUUID()
  to: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({ enum: MessageContentType })
  @IsEnum(MessageContentType)
  type: MessageContentType;

  @ApiPropertyOptional({ type: ImageContentRequest })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageContentRequest)
  imageContent: ImageContentRequest;
}
