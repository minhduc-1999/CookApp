import { InteractiveTargetType } from "enums/social.enum"

export interface IInteractiveRequest {
  targetId: string
  targetType: InteractiveTargetType
}
