import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { RequestType } from "constants/request.constant";
import { Certificate } from "domains/social/certificate.domain";
import { Image } from "domains/social/media.domain";

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

  @ApiProperty({ type: String })
  number: string;

  @ApiProperty({ type: String })
  title: string;

  toDomain(): Certificate {
    return new Certificate({
      title: this.title,
      issueAt: new Date(this.issueAt),
      issueBy: this.issueBy,
      expireAt: new Date(this.expireAt),
      image: new Image({ key: this.image }),
      number: this.number
    });
  }
}

export class SendRequestRequestDTO {
  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ type: [CertificateRequestDTO] })
  @ValidateNested()
  @Type(() => CertificateRequestDTO)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique(cert => cert.number)
  certs: CertificateRequestDTO[];
}
