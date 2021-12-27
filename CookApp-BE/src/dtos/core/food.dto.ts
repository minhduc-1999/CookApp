import { ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Expose, Type } from "class-transformer";

class Unit {
  @Expose()
  @ApiPropertyOptional({ type: String })
  unit: string;
  @Expose()
  @ApiPropertyOptional({ type: Number })
  value: number;
}
class Ingredient {
  @Expose()
  @Type(() => Unit)
  @ApiPropertyOptional({ type: Unit })
  unit: Unit;
  @Expose()
  @ApiPropertyOptional({ type: String })
  name: string;
  @Expose()
  @ApiPropertyOptional({ type: Number })
  quantity: number;
}

class Step {
  @Expose()
  @ApiPropertyOptional({ type: String })
  content: string;
  @Expose()
  @ApiPropertyOptional({ type: [String] })
  photos: string[];
}
export class FoodDTO extends AuditDTO {
  @Expose()
  @ApiPropertyOptional({ type: Number })
  servings: number;

  @Expose()
  @ApiPropertyOptional({ type: String })
  name: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  description: string;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  photos: string[];

  @Expose()
  @ApiPropertyOptional({ type: Number })
  totalTime: number;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  cookingMethod: string[];

  @Expose()
  @ApiPropertyOptional({ type: String })
  group: string;

  @Expose()
  @ApiPropertyOptional({ type: [Step] })
  @Type(() => Step)
  steps: Step[];

  @Expose()
  @ApiPropertyOptional({ type: Ingredient })
  @Type(() => Ingredient)
  ingredients: Ingredient;

  @Expose()
  @ApiPropertyOptional({ type: String })
  origin: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  videoUrl: string;
}
