import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { IsMeaningfullString } from "decorators/IsMeaningfullString.decorator";

export class PostDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  @IsMeaningfullString(2)
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: [String] })
  images: string[];

  @IsString({ each: true })
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  videos: string[];

  constructor(post: Partial<PostDTO>) {
    super(post);
    this.id = post?.id;
    this.content = post?.content;
    this.images = post?.images;
    this.videos = post?.videos;
  }
}

export class CreatePostDTO extends PostDTO {}
