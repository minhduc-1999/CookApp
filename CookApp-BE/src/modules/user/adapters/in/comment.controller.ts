import {
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { Transaction } from "decorators/transaction.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/user.dto";
import { CreateCommentCommand } from "modules/user/useCases/createComment";
import { CreateCommentRequest } from "modules/user/useCases/createComment/createCommentRequest";
import { CreateCommentResponse } from "modules/user/useCases/createComment/createCommentResponse";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";

@Controller("users/posts/:postId")
@ApiTags("User/Comment")
@ApiBearerAuth()
export class CommentController {
  constructor(private _commandBus: CommandBus) {}

  @Post('comments')
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    CreateCommentResponse,
    "Create comment successfully"
  )
  @Transaction()
  async createComment(
    @Param('postId', ParseObjectIdPipe) postId: string,
    @Body() body: CreateCommentRequest,
    @User() user: UserDTO
  ): Promise<Result<CreateCommentResponse>> {
    body.postId = postId;
    const commentsQuery = new CreateCommentCommand(user, body);
    const result = await this._commandBus.execute(commentsQuery);
    return Result.ok(result, {
      messages: ["Get comment's comments successfully"],
    });
  }
}
