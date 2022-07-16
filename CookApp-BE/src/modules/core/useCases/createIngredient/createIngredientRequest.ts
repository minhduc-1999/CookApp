import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { WordLength } from "decorators/wordLength.decorator";

export class CreateIngredientRequest {
  @WordLength(1)
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  kcal?: number;
}
