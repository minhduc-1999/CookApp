import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { IRequestRepository } from "modules/user/adapters/out/repositories/request.repository";
import { IRequestService } from "modules/user/services/request.service";
import { GetAllRequestsRequestDTO } from "./getAllRequests.request";
import { GetAllRequestsResponseDTO } from "./getAllRequests.response";

export class GetAllRequestsQuery extends BaseQuery {
  queryOpt: GetAllRequestsRequestDTO;
  constructor(user: User, queryOptions: GetAllRequestsRequestDTO) {
    super(user);
    this.queryOpt = queryOptions;
  }
}

@QueryHandler(GetAllRequestsQuery)
export class GetAllRequestsUseCase
  implements IQueryHandler<GetAllRequestsQuery>
{
  constructor(
    @Inject("IRequestRepository")
    private _requestRepo: IRequestRepository,
    @Inject("IRequestService")
    private _requestService: IRequestService
  ) {}
  async execute(
    query: GetAllRequestsQuery
  ): Promise<GetAllRequestsResponseDTO> {
    const { queryOpt } = query;

    let [requests, total] = await this._requestRepo.getAllRequest(queryOpt);

    requests = await this._requestService.fulfillData(requests);

    let meta: PageMetadata;
    if (requests.length > 0) {
      meta = new PageMetadata(queryOpt.offset, queryOpt.limit, total);
    }

    return new GetAllRequestsResponseDTO(requests, meta);
  }
}
