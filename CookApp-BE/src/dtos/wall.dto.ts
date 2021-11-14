import { ApiProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { PostDTO } from "./post.dto";

export class WallDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  content: string;

  @Exclude({ toPlainOnly: true })
  images: string[];

  @IsEmail()
  videos: string[];

  @Type(() => PostDTO)
  posts: PostDTO[];

  constructor(feed: Partial<WallDTO>) {
    super(feed);
    this.id = feed?.id;
    this.content = feed?.content;
    this.images = feed?.images;
    this.videos = feed?.videos;
    this.posts = feed?.posts;
  }
}
