import { AuditDTO } from "base/dto/audit.dto";
import { PostDTO } from "dtos/social/post.dto";
import { ReactionType } from "enums/reaction.enum";

export class GetPostResponse extends AuditDTO {
  constructor(post: PostDTO) {
    super(post);
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
  content: string;
  images: string[];
  videos: string[];
  author: {
    id: string;
    avatar: string;
    displayName: string;
  };
  numOfReaction: number;
  numOfComment: number;
  reaction?: ReactionType;
}
