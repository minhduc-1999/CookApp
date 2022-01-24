import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
import { CreateCommentCommand } from "modules/user/useCases/createComment";
import { CreateCommentRequest } from "modules/user/useCases/createComment/createCommentRequest";
import { CreateCommentResponse } from "modules/user/useCases/createComment/createCommentResponse";
import {
  CommentPageOption,
  GetPostCommentsQuery,
} from "modules/user/useCases/getPostComments";
import { GetPostCommentsResponse } from "modules/user/useCases/getPostComments/getPostCommentsResponse";
import { Transaction } from "neo4j-driver";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";
import {
  ParseCommentPaginationPipe,
} from "pipes/parsePagination.pipe";

@Controller("users/posts/:postId")
@ApiTags("User/Comment")
@ApiBearerAuth()
export class CommentController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @Post("comments")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(CreateCommentResponse, "Create comment successfully")
  @RequestTransaction()
  async createComment(
    @Param("postId", ParseObjectIdPipe) postId: string,
    @Body() body: CreateCommentRequest,
    @User() user: UserDTO,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<CreateCommentResponse>> {
    body.postId = postId;
    const commentsQuery = new CreateCommentCommand(user, body, tx);
    const result = await this._commandBus.execute(commentsQuery);
    return Result.ok(result, {
      messages: ["Get comment's comments successfully"],
    });
  }

  @Get("comments")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetPostCommentsResponse,
    "Get post's comments successfully"
  )
  async getPostCommentsPosts(
    @Query(ParseCommentPaginationPipe) query: CommentPageOption,
    @User() user: UserDTO,
    @Param("postId", ParseObjectIdPipe) postId: string
  ): Promise<Result<GetPostCommentsResponse>> {
    const getCommentsQuery = new GetPostCommentsQuery(user, postId, query);
    const result = await this._queryBus.execute(getCommentsQuery);
    return Result.ok(result, {
      messages: ["Get post's comments successfully"],
    });
  }
}
