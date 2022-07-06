import { Inject, Logger, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IUserService } from "modules/auth/services/user.service";
import { ICertificateRepository } from "modules/user/adapters/out/repositories/certificate.repository";
import { ICertificateService } from "modules/user/services/certificate.service";
import { GetCertsRequest } from "./getCertificates.request";
import { GetCertsResponse } from "./getCertificates.response";

export class GetCertsQuery extends BaseQuery {
  queryOpt: GetCertsRequest;
  targetId: string;
  constructor(user: User, targetId: string, queryOptions: GetCertsRequest) {
    super(user);
    this.queryOpt = queryOptions;
    this.targetId = targetId;
  }
}

@QueryHandler(GetCertsQuery)
export class GetCertsUseCase implements IQueryHandler<GetCertsQuery> {
  private _logger = new Logger(GetCertsUseCase.name);
  constructor(
    @Inject("ICertificateRepository")
    private _certRepo: ICertificateRepository,
    @Inject("ICertificateService")
    private _certService: ICertificateService,
    @Inject("IUserService")
    private _userService: IUserService
  ) {}
  async execute(query: GetCertsQuery): Promise<GetCertsResponse> {
    const { queryOpt, targetId } = query;

    const target = await this._userService.getUserById(targetId);

    if (!target) {
      this._logger.error(`User ID [${targetId}] not found`);
      throw new NotFoundException(
        ResponseDTO.fail(`User not found`, UserErrorCode.USER_NOT_FOUND)
      );
    }

    let [certs, total] = await this._certRepo.getByUser(target, queryOpt);

    certs = await this._certService.fulfillData(certs);

    let meta: PageMetadata;
    if (certs.length > 0) {
      meta = new PageMetadata(queryOpt.offset, queryOpt.limit, total);
    }

    return new GetCertsResponse(certs, meta);
  }
}
