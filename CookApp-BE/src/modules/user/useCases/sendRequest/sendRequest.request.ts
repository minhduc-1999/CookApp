import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { RequestType } from "constants/request.constant";
import { Certificate } from "domains/social/certificate.domain";
import { Image } from "domains/social/media.domain";
import { User } from "domains/social/user.domain";

export class CertificateRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  issueBy: string;

  @ApiProperty({ type: String, default: "2022-07-05T16:23:47.174Z" })
  @IsISO8601()
  issueAt: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({ type: String, default: "2022-07-05T17:09:25.000Z" })
  @IsISO8601()
  @IsOptional()
  expireAt?: string;

  @ApiProperty({ type: String })
  number: string;

  @ApiProperty({ type: String })
  title: string;

  toDomain(owner: User): Certificate {
    return new Certificate({
      title: this.title,
      issueAt: new Date(this.issueAt),
      issueBy: this.issueBy,
      expireAt: new Date(this.expireAt),
      image: new Image({ key: this.image }),
      number: this.number,
      owner,
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
  @ArrayUnique((cert) => cert.number)
  certs: CertificateRequestDTO[];
}
