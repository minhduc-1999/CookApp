import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CertificateResponse } from "base/dtos/response.dto";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetCertificateDetailQuery } from "modules/user/useCases/getCertificateDetail";
import { GetCertsQuery } from "modules/user/useCases/getCertificates";
import { GetCertsRequest } from "modules/user/useCases/getCertificates/getCertificates.request";
import { GetCertsResponse } from "modules/user/useCases/getCertificates/getCertificates.response";

@Controller()
@ApiTags("Requests")
@ApiBearerAuth()
export class CertificateController {
  constructor(private _queryBus: QueryBus) {}

  @Get("users/:userId/certificates")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetCertsResponse)
  async getCerts(
    @Query()
    queryOpt: GetCertsRequest,
    @HttpUserReq() user: User,
    @Param("userId", ParseUUIDPipe) targetId: string
  ): Promise<Result<void>> {
    const query = new GetCertsQuery(user, targetId, queryOpt);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Successfully"] });
  }

  @Get("certificates/:certId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(CertificateResponse)
  async getCertDetail(
    @HttpUserReq() user: User,
    @Param("certId", ParseUUIDPipe) certId: string
  ): Promise<Result<void>> {
    const query = new GetCertificateDetailQuery(certId, user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Successfully"] });
  }
}
