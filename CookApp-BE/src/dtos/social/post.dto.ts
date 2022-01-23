import { AuditDTO } from "base/dtos/audit.dto";
import { ReactionDTO } from "./reaction.dto";
import { UserDTO } from "./user.dto";

export class PostDTO extends AuditDTO {
  content: string;

  images?: string[];

  videos?: string[];

  author: UserDTO

  reactions: ReactionDTO[];

  numOfReaction: number;

  numOfComment: number;

  constructor(post: Partial<PostDTO>) {
    super(post)
    this.content = post?.content
    this.images = post?.images
    this.videos = post?.videos
    this.author = post?.author
    this.reactions = post?.reactions
    this.numOfComment = post?.numOfComment
    this.numOfReaction = post?.numOfReaction
  }
}
