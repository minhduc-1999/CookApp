import { ApiResponseProperty } from "@nestjs/swagger";
import { PostDTO } from "dtos/social/post.dto";
import { ReactionType } from "enums/reaction.enum";

export class GetPostResponse {
  constructor(post: PostDTO) {
    this.content = post.content;
    this.images = post.images;
    this.videos = post.videos;
    this.author = {
      avatar: post.author?.avatar,
      id: post.author?.id,
      displayName: post.author.displayName,
    };
    this.numOfComment = post.numOfComment;
    this.numOfReaction = post.numOfReaction;
  }
  @ApiResponseProperty({ type: String })
  content: string;
  @ApiResponseProperty({ type: [String] })
  images: string[];
  @ApiResponseProperty({ type: [String] })
  videos: string[];
  @ApiResponseProperty({ type: Object })
  author: {
    id: string;
    avatar: string;
    displayName: string;
  };
  @ApiResponseProperty({ type: Number })
  numOfReaction: number;
  @ApiResponseProperty({ type: Number })
  numOfComment: number;
  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;
}
