import { Body, Controller, Param, ParseUUIDPipe, Post as PostHttp } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { ReactCommand } from "modules/user/useCases/react";
import { ReactRequest } from "modules/user/useCases/react/reactRequest";
import { ReactResponse } from "modules/user/useCases/react/reactResponse";
import { Transaction } from "neo4j-driver";

@Controller("users/reaction")
@ApiTags("User/Reaction")
@ApiBearerAuth()
export class ReactionController {
  constructor(private _commandBus: CommandBus) {}

  @PostHttp()
  @RequestTransaction()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(ReactResponse, "Update react status successfully")
  async reactPost(
    @UserReq() user: User,
    @Body() body: ReactRequest,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<ReactResponse>> {
    const reactCommand = new ReactCommand(tx, user, body);
    const result = await this._commandBus.execute(reactCommand);
    return Result.ok(result, {
      messages: ["Update react status successfully"],
    });
  }
}
