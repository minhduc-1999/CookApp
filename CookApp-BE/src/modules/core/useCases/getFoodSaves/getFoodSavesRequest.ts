import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum } from "class-validator";
import { FoodSaveType } from "enums/core.enum";

export class GetFoodSavesRequest extends PageOptionsDto {
  @ApiProperty({ enum: FoodSaveType })
  @IsEnum(FoodSaveType)
  type: FoodSaveType;
}
