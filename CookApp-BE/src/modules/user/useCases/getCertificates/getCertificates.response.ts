import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { CertificateResponse } from "base/dtos/response.dto";
import { Certificate } from "domains/social/certificate.domain";

export class GetCertsResponse {
  @ApiResponseProperty({ type: [CertificateResponse] })
  certs: CertificateResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(certs: Certificate[], meta: PageMetadata) {
    this.certs = certs?.map((req) => new CertificateResponse(req));
    this.metadata = meta;
  }
}
