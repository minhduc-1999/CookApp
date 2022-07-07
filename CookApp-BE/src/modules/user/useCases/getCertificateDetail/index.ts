import { Inject, Logger, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { CertificateResponse, ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { ICertificateRepository } from "modules/user/adapters/out/repositories/certificate.repository";
import { ICertificateService } from "modules/user/services/certificate.service";

export class GetCertificateDetailQuery extends BaseQuery {
  certId: string;
  user: User;
  constructor(certId: string, user: User) {
    super(user);
    this.certId = certId;
  }
}

@QueryHandler(GetCertificateDetailQuery)
export class GetCertificateDetailUseCase
  implements IQueryHandler<GetCertificateDetailQuery>
{
  private _logger = new Logger(GetCertificateDetailUseCase.name);
  constructor(
    @Inject("ICertificateRepository")
    private _certRepo: ICertificateRepository,
    @Inject("ICertificateService")
    private _certService: ICertificateService
  ) {}
  async execute(
    query: GetCertificateDetailQuery
  ): Promise<CertificateResponse> {
    const { certId, user } = query;
    let cert = await this._certRepo.getById(certId);
    if (!cert || (!cert.isOwnedBy(user) && !cert.isConfirmed())) {
      this._logger.error(`Cert ID [${certId}] not found`);
      throw new NotFoundException(
        ResponseDTO.fail(
          "Certificate not found",
          UserErrorCode.CERTIFICATE_NOT_FOUND
        )
      );
    }
    [cert] = await this._certService.fulfillData([cert]);
    return new CertificateResponse(cert);
  }
}
