import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiBadReqResponseCustom,
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { MongooseSession } from "decorators/mongooseSession.decorator";
import { Transaction } from "decorators/transaction.decorator";
import { User } from "decorators/user.decorator";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { CreatePostCommand } from "modules/user/useCases/createPost";
import { CreatePostRequest } from "modules/user/useCases/createPost/createPostRequest";
import { CreatePostResponse } from "modules/user/useCases/createPost/createPostResponse";
import { EditPostCommand } from "modules/user/useCases/editPost";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { EditPostResponse } from "modules/user/useCases/editPost/editPostResponse";
import { GetPostDetailQuery } from "modules/user/useCases/getPostById";
import { GetPostResponse } from "modules/user/useCases/getPostById/getPostResponse";
import { ClientSession } from "mongoose";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";

@Controller("/users/posts")
@ApiTags("User")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post()
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(CreatePostResponse, "Create post successfully")
  @Transaction()
  async createPost(
    @Body() post: CreatePostRequest,
    @User() user: UserDTO,
    @MongooseSession() session: ClientSession
  ): Promise<Result<PostDTO>> {
    const createPostCommand = new CreatePostCommand(user, post);
    const createdPost = await this._commandBus.execute(createPostCommand);
    return Result.ok(createdPost, { messages: ["Create post successfully"] });
  }

  @Get(":postId")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(GetPostResponse, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
  async getPostById(
    @Param("postId", ParseObjectIdPipe) postId: string,
    @Req() req
  ): Promise<Result<GetPostResponse>> {
    const query = new GetPostDetailQuery(req.user, postId);
    const post = await this._queryBus.execute(query);
    return Result.ok(post, { messages: ["Get post successfully"] });
  }

  @Patch(":postId")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(EditPostResponse, "Edit post successfully")
  async editPost(
    @Body() post: EditPostRequest,
    @Req() req,
    @Param("postId", ParseObjectIdPipe) postId: string
  ): Promise<Result<EditPostResponse>> {
    post.id = postId;
    const editPostCommand = new EditPostCommand(req.user, post);
    const updatedPost = await this._commandBus.execute(editPostCommand);
    return Result.ok(updatedPost, { messages: ["Edit post successfully"] });
  }
}
