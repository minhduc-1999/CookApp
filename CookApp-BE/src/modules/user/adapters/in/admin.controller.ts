import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetAllRequestsQuery } from "modules/user/useCases/getAllRequests";
import { GetAllRequestsResponseDTO } from "modules/user/useCases/getAllRequests/getAllRequests.response";
import { GetAllRequestsRequestDTO } from "modules/user/useCases/getAllRequests/getAllRequests.request";
import { ConfirmCertRequestDTO } from "modules/user/useCases/confirmCertRequest/confirmCertRequest";
import { ConfirmCertCommand } from "modules/user/useCases/confirmCertRequest";
import { ConfirmRequestDTO } from "modules/user/useCases/confirmRequest/confirmRequest";
import { ConfirmRequestCommand } from "modules/user/useCases/confirmRequest";

@Controller("admin")
@ApiTags("Requests")
@ApiBearerAuth()
@RequirePermissions("manage_request")
export class AdminController {
  constructor(private _queryBus: QueryBus, private _commandBus: CommandBus) {}

  @Get("requests")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetAllRequestsResponseDTO)
  async getAllRequests(
    @Query()
    queryOpt: GetAllRequestsRequestDTO,
    @HttpUserReq() user: User
  ): Promise<Result<GetAllRequestsResponseDTO>> {
    const query = new GetAllRequestsQuery(user, queryOpt);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Successfully"] });
  }

  @Put("certificates/:certId/censorship")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Successfully")
  async confirmCert(
    @HttpUserReq() user: User,
    @Param("certId", ParseUUIDPipe) certId: string,
    @Body() body: ConfirmCertRequestDTO
  ): Promise<Result<string>> {
    body.certId = certId;
    const confirmCertCommand = new ConfirmCertCommand(null, user, body);
    await this._commandBus.execute(confirmCertCommand);
    return Result.ok(null, { messages: ["Successfully"] });
  }

  @Put("requests/:requestId/censorship")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Successfully")
  async confirmRequest(
    @HttpUserReq() user: User,
    @Param("requestId", ParseUUIDPipe) requestId: string,
    @Body() body: ConfirmRequestDTO
  ): Promise<Result<string>> {
    body.requestId = requestId;
    const command = new ConfirmRequestCommand(null, user, body);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Successfully"] });
  }
}
