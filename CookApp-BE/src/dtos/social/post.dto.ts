import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
  PickType,
} from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/IsMeaningfulString.decorator";
import { ReactionDTO } from "./reaction.dto";
import { UserDTO } from "./user.dto";

export class PostDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  @IsMeaningfulString(2)
  @Expose()
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  @Expose()
  images?: string[];

  @IsString({ each: true })
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Expose()
  videos?: string[];

  @Expose()
  @Type(() => UserDTO)
  @ApiResponseProperty({
    type: () => PickType(UserDTO, ["id", "avatar", "displayName"]),
  })
  author: Pick<UserDTO, "avatar" | "id" | "displayName">;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Type(() => ReactionDTO)
  reactions: ReactionDTO[];

  @Expose()
  numOfReaction: number;

  @Expose()
  numOfComment: number;

  static create(
    post: Pick<PostDTO, "content" | "images" | "videos" | "author">
  ): PostDTO {
    const createdPost = new PostDTO();
    createdPost.create(post?.author.id);
    createdPost.content = post?.content;
    createdPost.images = post?.images;
    createdPost.videos = post?.videos;
    createdPost.author = post?.author;
    return createdPost;
  }
}
