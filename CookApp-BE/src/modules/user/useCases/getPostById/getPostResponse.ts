import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { ReactionType } from "enums/reaction.enum";

class Author extends PickType(User, ["id", "avatar", "displayName"]) { }

export class GetPostResponse {
  constructor(post: Post) {
    this.id = post.id
    this.createdAt = post.createdAt
    this.updatedAt = post.updatedAt
    this.updatedBy = post.updatedBy
    this.content = post.content;
    this.images = post.images;
    this.videos = post.videos;
    this.author = {
      avatar: post.author?.avatar,
      id: post.author?.id,
      displayName: post.author?.displayName,
    };
    this.numOfComment = post.numOfComment;
    this.numOfReaction = post.numOfReaction;
  }

  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: Number})
  createdAt: number

  @ApiResponseProperty({ type: Number})
  updatedAt?: number

  @ApiResponseProperty({ type: String})
  updatedBy?: string

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [String] })
  images: string[];

  @ApiResponseProperty({ type: [String] })
  videos: string[];

  @ApiResponseProperty({ type: Author })
  author: Author

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;
}
