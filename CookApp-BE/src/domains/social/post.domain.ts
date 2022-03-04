import { Audit } from "domains/audit.domain";
import _ = require("lodash");
import { User } from "./user.domain";

export abstract class PostBase extends Audit {
  author: User
  numOfReaction: number;
  numOfComment: number;

  constructor(post: Partial<PostBase>) {
    super(post)
    this.author = post?.author
    this.numOfComment = post?.numOfComment
    this.numOfReaction = post?.numOfReaction
  }
}

export class Moment extends PostBase {
  content: string
  images?: string[]
  videos?: string[]
  kind: "Moment"
  constructor(post: Partial<Moment>) {
    super(post)
    this.content = post.content
    this.images = post.images ?? []
    this.videos = post.videos ?? []
    this.kind = "Moment"
  }
}

export class Album extends PostBase {
  name: string
  images?: string[]
  videos?: string[]
  kind: "Album"
  constructor(post: Partial<Album>) {
    super(post)
    this.name = post.name
    this.images = post.images ?? []
    this.videos = post.videos ?? []
    this.kind = "Album"
  }
}

export type Post = Album | Moment

export class SavedPost {
  savedAt: number
  saver: User
  post: Post

  constructor(item: Partial<SavedPost>) {
    this.savedAt = item.savedAt ?? _.now()
    this.saver = item.saver
    this.post = item.post
  }
}
