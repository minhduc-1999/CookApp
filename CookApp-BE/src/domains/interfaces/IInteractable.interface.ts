import { User } from "domains/social/user.domain"
import { InteractiveTargetType } from "enums/social.enum"

export interface IInteractable {

  type: InteractiveTargetType

  numOfReaction: number
  
  numOfComment: number

  author: User
}
