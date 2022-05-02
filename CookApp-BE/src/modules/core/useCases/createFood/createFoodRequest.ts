import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordMaxLength } from "decorators/wordMaxLength.decorator";

class IngredientRequest {
  @WordMaxLength(1)
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  unit: string;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Min(0)
  quantity: number;
}

class RecipeStepRequest {
  @ApiProperty({ type: String })
  @IsString()
  content: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
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
  @Type(() => RecipeStepRequest)
  @ValidateNested()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  steps: RecipeStepRequest[];

  @ApiProperty({ type: [IngredientRequest] })
  @IsArray()
  @Type(() => IngredientRequest)
  @ValidateNested()
  @ArrayMinSize(1)
  @ArrayUnique((item) => item.name)
  @ArrayMaxSize(50)
  ingredients: IngredientRequest[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @IsFileExtensions(["mp4"])
  videoUrl?: string;

  @WordMaxLength(1)
  @ApiProperty({ type: String, description: "Food's name" })
  name: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordMaxLength(1)
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @ArrayMinSize(1)
  photos?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  url: string;
}
