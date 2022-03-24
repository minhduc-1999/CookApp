import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { InteractiveTargetType, PostType } from "../../enums/social.enum";
import _ = require("lodash");
import { Media } from "./media.domain";
import { User } from "./user.domain";

export abstract class PostBase extends Audit implements IInteractable{

  constructor(post: Partial<PostBase>) {
    super(post)
    this.type = post?.type
    this.numOfComment = post?.numOfComment
    this.numOfReaction = post?.numOfReaction
    this.author = post?.author
    this.content = post?.content
    this.location = post?.location
    this.type = InteractiveTargetType.POST
  }

  type: InteractiveTargetType;

  numOfReaction: number;

  numOfComment: number;

  author: User;

  content: string

  kind: PostType

  location: string

  abstract canCreate(): boolean
}

export class Moment extends PostBase {

  canCreate(): boolean {
    if (!this.content)
      return false
    return true
  }

  images?: Media[]
  videos?: Media[]
  constructor(post: Partial<Moment>) {
    super(post)
    this.images = post.images ?? []
    this.videos = post.videos ?? []
    this.kind = PostType.MOMENT
  }
}

export class Album extends PostBase {
  canCreate(): boolean {
    if (!this.name)
      return false
    return true
  }
  name: string
  images?: Media[]
  videos?: Media[]

  constructor(post: Partial<Album>) {
    super(post)
    this.name = post.name
    this.images = post.images ?? []
    this.videos = post.videos ?? []
    this.kind = PostType.ALBUM
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

