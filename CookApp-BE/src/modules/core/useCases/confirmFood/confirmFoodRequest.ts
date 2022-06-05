import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { FoodStatusType } from "enums/core.enum";

export class ConfirmFoodRequest {
  @ApiProperty({ enum: FoodStatusType })
  @IsEnum(FoodStatusType)
  type: FoodStatusType;

  foodId: string
}
