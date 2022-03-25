import { Audit } from "../../domains/audit.domain";
import { ReactionType, Sex } from "../../enums/social.enum";
import { Media } from "./media.domain";
import { Account } from "./account.domain";
import { generateDisplayName } from "../../utils";
import { Follow } from "./follow.domain";
import { Post, SavedPost } from "./post.domain";
import { Reaction } from "./reaction.domain";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Comment } from "./comment.domain";


export class User extends Audit {
  id: string 

  avatar?: Media;

  displayName?: string;

  height?: number;

  weight?: number;

  birthDate?: Date;

  firstName?: string;

  lastName?: string;

  sex?: Sex;

  nFollowers?: number

  nFollowees?: number

  nPosts?: number

  account?: Account

  constructor(user: Partial<User>) {
    super(user)
    this.account = user?.account
    this.displayName = user?.displayName ?? generateDisplayName()
    this.birthDate = user?.birthDate
    this.avatar = user?.avatar
    this.height = user?.height
    this.weight = user?.weight
    this.firstName = user?.firstName
    this.lastName = user?.lastName
    this.sex = user?.sex
    this.nPosts = user?.nPosts
    this.nFollowees = user?.nFollowees
    this.nFollowers = user?.nFollowers
  }

  follow(followee: User): Follow {
    return new Follow({
      follower: this,
      followee
    })
  }

  react(target: IInteractable, type: ReactionType ): Reaction {
    return new Reaction({
      reactor: this,
      target: target,
      type
    })
  }

  savePost(target: Post): SavedPost{
    return new SavedPost({
      saver: this,
      post: target
    })
  }

  comment(target: IInteractable, content: string, medias?: Media[], replyFor?: Comment): Comment {
    return new Comment({
      target: target,
      parent: replyFor,
      content,
      medias,
      user: this
    })
  } 
}
