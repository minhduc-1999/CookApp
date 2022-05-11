import {
    ApiPropertyOptional
} from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class EditVoteRequest {
  @ApiPropertyOptional({ type: Number })
  @Max(5)
  @Min(1)
  @IsNumber()
  @IsOptional()
  star: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  comment: string 

  foodId: string
}
