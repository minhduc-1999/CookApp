import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/IsMeaningfulString.decorator";
import { UserDTO } from "./user.dto";

export class PostDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  @IsMeaningfulString(2)
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml"], { each: true })
  @IsOptional()
  images?: string[];

  @IsString({ each: true })
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  videos?: string[];

  @Exclude()
  author: Pick<UserDTO, "id" | "avatar" | "displayName">;

  constructor(post: Partial<PostDTO>) {
    super(post);
    this.id = post?.id;
    this.content = post?.content;
    this.images = post?.images;
    this.videos = post?.videos;
    const { id, avatar, displayName } = post?.author;
    this.author = { id, avatar, displayName };
  }
}
