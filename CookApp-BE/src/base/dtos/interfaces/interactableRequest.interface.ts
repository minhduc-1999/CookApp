import { InteractiveTargetType } from "enums/social.enum"

export interface IInteractiveRequest {
  targetKeyOrID: string
  targetType: InteractiveTargetType
}
