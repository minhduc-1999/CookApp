import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { CertificateStatus } from "constants/certificate.constant";

export class ConfirmCertRequestDTO {

  @ApiProperty({ enum: CertificateStatus })
  @IsEnum(CertificateStatus)
  status: CertificateStatus;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  note: string;

  certId: string;
}
