import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FoodSaveType } from "enums/core.enum";

export class SaveFoodRequest {
  foodId: string;

  @IsEnum(FoodSaveType)
  @ApiProperty({ enum: FoodSaveType })
  type: FoodSaveType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  forceUpdate: boolean;
}
