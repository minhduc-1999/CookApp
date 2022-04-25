import { Food } from "../../domains/core/food.domain";
import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { PostType } from "../../enums/social.enum";
import { CommentMedia } from "./media.domain";
import { User } from "./user.domain";

export abstract class PostBase extends Audit implements IInteractable {

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

  abstract update(data: Partial<PostBase>): Partial<PostBase>
}

export class Moment extends PostBase {

  update(data: Partial<Moment>): Partial<Moment> {
    return {
      content: data.content ?? this.content,
      location: data.location ?? this.location,
      medias: data.medias ?? this.medias
    }
  }

  canCreate(): boolean {
    if (!this.content)
      return false
    return true
  }

  medias?: CommentMedia[]

  ref?: Food

  constructor(post: Partial<Moment>) {
    super(post)
    this.medias = post.medias ?? []
    this.type = PostType.MOMENT
    this.ref = post?.ref
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

