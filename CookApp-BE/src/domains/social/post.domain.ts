import { ApiResponseProperty } from "@nestjs/swagger";
import { Audit } from "domains/audit.domain";
import _ = require("lodash");
import { User } from "./user.domain";

export class Post extends Audit {
  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [String] })
  images?: string[];

  @ApiResponseProperty({ type: [String] })
  videos?: string[];

  @ApiResponseProperty({ type: User })
  author: User

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  constructor(post: Partial<Post>) {
    super(post)
    this.content = post?.content
    this.images = post?.images ?? []
    this.videos = post?.videos ?? []
    this.author = post?.author
    this.numOfComment = post?.numOfComment
    this.numOfReaction = post?.numOfReaction
  }
}


export class SavedPost extends Post {
  @ApiResponseProperty({ type: Number})
  savedAt: number

  constructor(post: Partial<SavedPost>) {
    super(post)
    this.savedAt = post.savedAt ?? _.now()
  }
}
