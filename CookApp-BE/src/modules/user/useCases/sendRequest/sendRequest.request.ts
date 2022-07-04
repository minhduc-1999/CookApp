import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { RequestType } from "constants/request.constant";

export class CertificateRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  issueBy: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  issueAt: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  expireAt?: number;

  @ApiProperty({type: String})
  number: string

  @ApiProperty({type: String})
  title: string
}

export class SendRequestRequestDTO {
  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ type: [CertificateRequestDTO] })
  @ValidateNested()
  @Type(() => CertificateRequestDTO)
  certs: CertificateRequestDTO[];
}
