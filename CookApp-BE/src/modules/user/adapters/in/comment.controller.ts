import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateCommentCommand } from "modules/user/useCases/createComment";
import { CreateCommentRequest } from "modules/user/useCases/createComment/createCommentRequest";
import { CreateCommentResponse } from "modules/user/useCases/createComment/createCommentResponse";
import { GetCommentsQuery } from "modules/user/useCases/getComments";
import { GetCommentsRequest } from "modules/user/useCases/getComments/getCommentsRequest";
import { GetCommentsResponse } from "modules/user/useCases/getComments/getCommentsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users/comments")
@ApiTags("User/Comment")
@ApiBearerAuth()
export class CommentController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @Post()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(CreateCommentResponse, "Create comment successfully")
  @HttpRequestTransaction()
  async createComment(
    @Body() body: CreateCommentRequest,
    @UserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<CreateCommentResponse>> {
    const commentsQuery = new CreateCommentCommand(user, body, tx);
    const result = await this._commandBus.execute(commentsQuery);
    return Result.ok(result, {
      messages: ["Create comments successfully"],
    });
  }

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetCommentsResponse,
    "Get post's comments successfully"
  )
  async getPostCommentsPosts(
    @Query(new ParseHttpRequestPipe<typeof GetCommentsRequest>()) query: GetCommentsRequest,
    @UserReq() user: User,
  ): Promise<Result<GetCommentsResponse>> {
    const getCommentsQuery = new GetCommentsQuery(user, query);
    const result = await this._queryBus.execute(getCommentsQuery);
    return Result.ok(result, {
      messages: ["Get post's comments successfully"],
    });
  }
}
