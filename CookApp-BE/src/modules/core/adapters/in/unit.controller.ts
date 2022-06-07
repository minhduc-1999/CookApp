import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustomWithoutData,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateUnitCommand } from "modules/core/useCases/createUnit";
import { CreateUnitRequest } from "modules/core/useCases/createUnit/createUnitRequest";
import { DeleteUnitCommand } from "modules/core/useCases/deleteUnit";
import { GetUnitsQuery } from "modules/core/useCases/getUnits";
import { GetUnitsResponse } from "modules/core/useCases/getUnits/getUnitsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("units")
@ApiTags("Units")
@ApiBearerAuth()
@RequirePermissions("manage_unit")
export class UnitController {
  constructor(private _queryBus: QueryBus, private _commandBus: CommandBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetUnitsResponse, "Get units successfully")
  @RequirePermissions("read_unit")
  async getUnits(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetUnitsResponse>> {
    const unitsQuery = new GetUnitsQuery(user, query);
    const result = await this._queryBus.execute(unitsQuery);
    return Result.ok(result, {
      messages: ["Get units successfully"],
    });
  }

  @ApiFailResponseCustom()
  @HttpRequestTransaction()
  @ApiCreatedResponseCustomWithoutData("Create unit successfully")
  @Post()
  @RequirePermissions("create_unit")
  async createUnit(
    @Body() req: CreateUnitRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<string>> {
    const createUnitCommand = new CreateUnitCommand(user, req, tx);
    const newId = await this._commandBus.execute(createUnitCommand);
    return Result.ok(newId, { messages: ["Create unit successfully"] });
  }

  @Delete(":unitId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete unit successfully")
  @HttpRequestTransaction()
  async deleteUnit(
    @HttpUserReq() user: User,
    @Param("unitId", ParseUUIDPipe) unitId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const command = new DeleteUnitCommand(user, tx, unitId)
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Delete unit successfully"] });
  }
}
