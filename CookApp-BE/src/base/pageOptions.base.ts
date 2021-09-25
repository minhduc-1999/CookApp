import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly offset: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(10, { message: 'take have min values = 10 & max = 50' })
  @Max(50, { message: 'take have min values = 10 & max = 50' })
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly q?: string = '';
}
