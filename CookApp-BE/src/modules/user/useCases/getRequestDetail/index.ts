import {
  ForbiddenException,
  Inject,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import {
  RequestResponse,
  ResponseDTO,
} from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IRequestRepository } from "modules/user/adapters/out/repositories/request.repository";
import { ICertificateService } from "modules/user/services/certificate.service";

export class GetRequestDetailQuery extends BaseQuery {
  requestId: string;
  user: User;
  constructor(requestId: string, user: User) {
    super(user);
    this.requestId = requestId;
  }
}

@QueryHandler(GetRequestDetailQuery)
export class GetRequestDetailUseCase
  implements IQueryHandler<GetRequestDetailQuery>
{
  private _logger = new Logger(GetRequestDetailUseCase.name);
  constructor(
    @Inject("IRequestRepository")
    private _requestRepo: IRequestRepository,
    @Inject("ICertificateService")
    private _certService: ICertificateService
  ) {}
  async execute(query: GetRequestDetailQuery): Promise<RequestResponse> {
    const { requestId, user } = query;
    let request = await this._requestRepo.getById(requestId);
    if (!request) {
      this._logger.error(`Request ID [${requestId}] not found`);
      throw new NotFoundException(
        ResponseDTO.fail("Request not found", UserErrorCode.REQUEST_NOT_FOUND)
      );
    }
    if (!request.isSenderBy(user)) {
      this._logger.error(
        `User ID [${user.id}] do not have permission to read request ID [${requestId}]`
      );
      throw new ForbiddenException();
    }
    request.certificates = await this._certService.fulfillData(
      request.certificates
    );
    return new RequestResponse(request);
  }
}
