import { Body, Controller, Post as PostHttp } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { ReactCommand } from "modules/user/useCases/react";
import { ReactRequest } from "modules/user/useCases/react/reactRequest";
import { ReactResponse } from "modules/user/useCases/react/reactResponse";

@Controller("users/reaction")
@ApiTags("User/Reaction")
@ApiBearerAuth()
export class ReactionController {
  constructor(private _commandBus: CommandBus) {}

  @PostHttp()
  @HttpRequestTransaction()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(ReactResponse, "Update react status successfully")
  async reactPost(
    @HttpUserReq() user: User,
    @Body() body: ReactRequest,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<ReactResponse>> {
    const reactCommand = new ReactCommand(tx, user, body);
    const result = await this._commandBus.execute(reactCommand);
    return Result.ok(result, {
      messages: ["Update react status successfully"],
    });
  }
}
