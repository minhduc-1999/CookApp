import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum, IsOptional } from "class-validator";
import { CertificateStatus } from "constants/certificate.constant";

export class GetCertsRequest extends PageOptionsDto {
  @ApiPropertyOptional({ enum: CertificateStatus })
  @IsEnum(CertificateStatus)
  @IsOptional()
  status?: CertificateStatus;
}
