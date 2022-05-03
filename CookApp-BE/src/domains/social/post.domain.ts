import { Food } from "../../domains/core/food.domain";
import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { PostType } from "../../enums/social.enum";
import { PostMedia } from "./media.domain";
import { User } from "./user.domain";

export abstract class PostBase extends Audit implements IInteractable {

  constructor(post: Partial<PostBase>) {
    super(post)
    this.nComments = post?.nComments
    this.nReactions = post?.nReactions
    this.author = post?.author
    this.content = post?.content
    this.tags = post?.tags
    this.medias = post?.medias
  }

  nReactions: number;

  nComments: number;

  author: User;

  content: string

  type: PostType

  tags: string[]

  medias?: PostMedia[]

  abstract canCreate(): boolean

  abstract update(data: Partial<PostBase>): Partial<PostBase>
}

export class Moment extends PostBase {

  update(data: Partial<Moment>): Partial<Moment> {
    return {
      content: data.content ?? this.content,
      location: data.location ?? this.location,
      medias: data.medias ?? this.medias,
      tags: data.tags ?? this.tags
    }
  }

  canCreate(): boolean {
    if (!this.content)
      return false
    return true
  }

  location?: string

  constructor(post: Partial<Moment>) {
    super(post)
    this.type = PostType.MOMENT
    this.location = post?.location
  }
}

export class FoodShare extends PostBase {

  update(data: Partial<FoodShare>): Partial<FoodShare> {
    return {
      content: data.content ?? this.content,
      medias: data.medias ?? this.medias,
      tags: data.tags ?? this.tags,
      ref: data?.ref ?? this.ref
    }
  }

  canCreate(): boolean {
    if (!this.content)
      return false
    return true
  }

  ref: Food

  location?: string

  constructor(post: Partial<FoodShare>) {
    super(post)
    this.type = PostType.FOOD_SHARE
    this.ref = post?.ref
    this.location = post?.location
  }
}

export type Post = Moment | FoodShare

export class SavedPost extends Audit {
  saver: User
  post: Post

  constructor(item: Partial<SavedPost>) {
    super(item)
    this.saver = item?.saver
    this.post = item?.post
  }
}

