import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { FoodSaveType } from "enums/core.enum";

export class SaveFoodRequest {
  foodId: string;

  @IsEnum(FoodSaveType)
  @ApiProperty({ enum: FoodSaveType })
  type: FoodSaveType;
}
