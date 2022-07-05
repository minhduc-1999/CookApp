import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IRequestResitory } from "modules/user/adapters/out/repositories/request.repository";
import { ICertificateService } from "modules/user/services/certificate.service";
import { GetRequestsResponse } from "./getRequest.response";

export class GetRequestsQuery extends BaseQuery {
  queryOpt: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOpt = queryOptions;
  }
}

@QueryHandler(GetRequestsQuery)
export class GetRequestsUseCase implements IQueryHandler<GetRequestsQuery> {
  constructor(
    @Inject("IRequestRepository")
    private _requestRepo: IRequestResitory,
    @Inject("ICertificateService")
    private _certService: ICertificateService
  ) {}
  async execute(query: GetRequestsQuery): Promise<GetRequestsResponse> {
    const { queryOpt, user } = query;

    const [requests, total] = await this._requestRepo.getRequestsPaggination(
      user,
      queryOpt
    );

    for (const request of requests) {
      request.certificates = await this._certService.fulfillData(
        request.certificates
      );
    }

    let meta: PageMetadata;
    if (requests.length > 0) {
      meta = new PageMetadata(queryOpt.offset, queryOpt.limit, total);
    }

    return new GetRequestsResponse(requests, meta);
  }
}
