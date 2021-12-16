import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export class PageOptionsDto {
  // @ApiPropertyOptional({
  //   enum: Order,
  //   default: Order.ASC,
  // })
  // @IsEnum(Order)
  // @IsOptional()
  // readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1, { message: "Page size have min values = 1" })
  @Max(50, { message: "Page size have max values = 50" })
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  q?: string = "";
}
