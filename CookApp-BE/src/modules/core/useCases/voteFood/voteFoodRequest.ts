import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class VoteFoodRequest {
  foodId: string;

  @ApiProperty({ type: Number })
  @Max(5)
  @Min(1)
  @IsNumber()
  star: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  comment: string 
}
