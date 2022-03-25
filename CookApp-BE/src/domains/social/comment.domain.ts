import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { Media } from "./media.domain";
import { User } from "./user.domain";

export class Comment extends Audit {
  user: User;

  target: IInteractable

  content: string;

  replies?: Comment[];

  parent?: Comment;

  medias: Media[]

  nReplies: number
  constructor(comment?: Partial<Comment>) {
    super(comment)
    this.user = comment?.user
    this.target = comment?.target
    this.content = comment?.content
    this.replies = comment?.replies
    this.parent = comment?.parent
    this.medias = comment?.medias
    this.nReplies = comment?.nReplies
  }
}
