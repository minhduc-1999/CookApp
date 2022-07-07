import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { RequestResponse } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetOwnRequestsQuery } from "modules/user/useCases/getOwnRequests";
import { GetOwnRequestsResponse } from "modules/user/useCases/getOwnRequests/getOwnRequest.response";
import { GetRequestDetailQuery } from "modules/user/useCases/getRequestDetail";
import { SendRequestCommand } from "modules/user/useCases/sendRequest";
import { SendRequestRequestDTO } from "modules/user/useCases/sendRequest/sendRequest.request";
import { SendRequestResponseDTO } from "modules/user/useCases/sendRequest/sendRequest.response";

@Controller("requests")
@ApiTags("Requests")
@ApiBearerAuth()
@RequirePermissions("manage_request")
export class RequestController {
  constructor(private _queryBus: QueryBus, private _commandBus: CommandBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetOwnRequestsResponse)
  @RequirePermissions("read_request")
  async getOwnRequests(
    @Query()
    queryOpt: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetOwnRequestsResponse>> {
    const query = new GetOwnRequestsQuery(user, queryOpt);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Successfully"] });
  }

  @Get(":requestId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(RequestResponse)
  @RequirePermissions("read_request")
  async getRequestDetail(
    @HttpUserReq() user: User,
    @Param("requestId", ParseUUIDPipe) requestId: string
  ): Promise<Result<GetOwnRequestsResponse>> {
    const query = new GetRequestDetailQuery(requestId, user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Successfully"] });
  }

  @Post()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(SendRequestResponseDTO, "Create post successfully")
  @HttpRequestTransaction()
  @RequirePermissions("send_request")
  async createPost(
    @Body() body: SendRequestRequestDTO,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<SendRequestResponseDTO>> {
    const createPostCommand = new SendRequestCommand(user, body, tx);
    const result = await this._commandBus.execute(createPostCommand);
    return Result.ok(result, { messages: ["Send request successfully"] });
  }
}
