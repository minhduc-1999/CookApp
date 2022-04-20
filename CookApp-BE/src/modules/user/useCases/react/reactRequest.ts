import { ApiProperty } from "@nestjs/swagger";
import { IInteractiveRequest } from "base/dtos/interfaces/interactableRequest.interface";
import { IsEnum, IsUUID } from "class-validator";
import { InteractiveTargetType, ReactionType } from "enums/social.enum";

export class ReactRequest implements IInteractiveRequest {
  @ApiProperty({ type: String })
  @IsUUID()
  targetId: string;

  @ApiProperty({ enum: InteractiveTargetType })
  @IsEnum(InteractiveTargetType)
  targetType: InteractiveTargetType

  @ApiProperty({ enum: ReactionType })
  @IsEnum(ReactionType)
  react: ReactionType;
}
