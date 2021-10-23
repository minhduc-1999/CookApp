import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsMeaningfullString } from "decorators/IsMeaningfullString.decorator";
import { UserDTO } from "./user.dto";

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

  @Type(() => UserDTO)
  @IsOptional()
  author?: UserDTO

  constructor(post: Partial<PostDTO>, author?: UserDTO) {
    super(post);
    this.id = post?.id;
    this.content = post?.content;
    this.images = post?.images;
    this.videos = post?.videos;
    this.author = author;
  }
}

export class CreatePostDTO extends PostDTO {}
