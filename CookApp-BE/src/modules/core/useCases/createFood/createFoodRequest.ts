import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/isMeaningfulString.decorator";

class IngredientRequest {
  @IsMeaningfulString(1)
  @ApiProperty({ type: String })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  unit: string;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  quantity: number;
}

class RecipeStepRequest {
  @ApiProperty({ type: String})
  @IsString()
  content: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  photos?: string[];
}

export class CreateFoodRequest {
  @IsNumber()
  @Min(1)
  @ApiProperty({ type: Number })
  servings: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  @Min(1)
  totalTime: number;

  @IsArray()
  @ApiProperty({ type: [RecipeStepRequest] })
  steps: RecipeStepRequest[];

  @ApiProperty({ type: [IngredientRequest] })
  @IsArray()
  ingredients: IngredientRequest[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @IsFileExtensions(["mp4"])
  videoUrl?: string;

  @IsMeaningfulString(1)
  @ApiProperty({ type: String, description: "Food's name" })
  name: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsMeaningfulString(1)
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  photos?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  url: string;
}
