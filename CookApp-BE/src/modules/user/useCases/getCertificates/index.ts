import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { ICertificateRepository } from "modules/user/adapters/out/repositories/certificate.repository";
import { ICertificateService } from "modules/user/services/certificate.service";
import { GetCertsRequest } from "./getCertificates.request";
import { GetCertsResponse } from "./getCertificates.response";

export class GetCertsQuery extends BaseQuery {
  queryOpt: GetCertsRequest;
  constructor(user: User, queryOptions: GetCertsRequest) {
    super(user);
    this.queryOpt = queryOptions;
  }
}

@QueryHandler(GetCertsQuery)
export class GetCertsUseCase implements IQueryHandler<GetCertsQuery> {
  constructor(
    @Inject("ICertificateRepository")
    private _certRepo: ICertificateRepository,
    @Inject("ICertificateService")
    private _certService: ICertificateService
  ) {}
  async execute(query: GetCertsQuery): Promise<GetCertsResponse> {
    const { queryOpt, user } = query;

    let [certs, total] = await this._certRepo.getByUser(user, queryOpt);

    certs = await this._certService.fulfillData(certs);

    let meta: PageMetadata;
    if (certs.length > 0) {
      meta = new PageMetadata(queryOpt.offset, queryOpt.limit, total);
    }

    return new GetCertsResponse(certs, meta);
  }
}
