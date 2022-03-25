import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { PostType } from "../../enums/social.enum";
import _ = require("lodash");
import { Media } from "./media.domain";
import { User } from "./user.domain";

export abstract class PostBase extends Audit implements IInteractable{

  constructor(post: Partial<PostBase>) {
    super(post)
    this.nComments = post?.nComments
    this.nReactions = post?.nReactions
    this.author = post?.author
    this.content = post?.content
    this.location = post?.location
  }

  nReactions: number;

  nComments: number;

  author: User;

  content: string

  type: PostType

  location: string

  abstract canCreate(): boolean
}

export class Moment extends PostBase {

  canCreate(): boolean {
    if (!this.content)
      return false
    return true
  }

  medias?: Media[]
  constructor(post: Partial<Moment>) {
    super(post)
    this.medias = post.medias ?? []
    this.type = PostType.MOMENT
  }
}

export class Album extends PostBase {
  canCreate(): boolean {
    if (!this.name)
      return false
    return true
  }
  name: string
  medias?: Media[]

  constructor(post: Partial<Album>) {
    super(post)
    this.name = post.name
    this.medias = post.medias ?? []
    this.type = PostType.ALBUM
  }
}

export type Post = Moment

export class SavedPost extends Audit {
  saver: User
  post: Post

  constructor(item: Partial<SavedPost>) {
    super(item)
    this.saver = item?.saver
    this.post = item?.post
  }
}

