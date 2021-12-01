import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
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
import { ReactPostCommand } from "modules/user/useCases/reactPost";
import { ReactPostRequest } from "modules/user/useCases/reactPost/reactPostRequest";
import { ClientSession } from "mongoose";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";
import { retrieveObjectNameFromUrl } from "utils";

@Controller("users/posts")
@ApiTags("User/Post")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreatePostResponse, "Create post successfully")
  @Transaction()
  async createPost(
    @Body() post: CreatePostRequest,
    @User() user: UserDTO,
    @MongooseSession() session: ClientSession
  ): Promise<Result<PostDTO>> {
    const createPostCommand = new CreatePostCommand(user, post, session);
    const createdPost = await this._commandBus.execute(createPostCommand);
    return Result.ok(createdPost, { messages: ["Create post successfully"] });
  }

  @Get(":postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetPostResponse, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
  async getPostById(
    @Param("postId", ParseObjectIdPipe) postId: string,
    @User() user: UserDTO
  ): Promise<Result<GetPostResponse>> {
    const query = new GetPostDetailQuery(user, postId);
    const post = await this._queryBus.execute(query);
    return Result.ok(post, { messages: ["Get post successfully"] });
  }

  @Patch(":postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(EditPostResponse, "Edit post successfully")
  async editPost(
    @Body() post: EditPostRequest,
    @User() user: UserDTO,
    @Param("postId", ParseObjectIdPipe) postId: string
  ): Promise<Result<EditPostResponse>> {
    post.id = postId;
    console.log('validate', post)
    const editPostCommand = new EditPostCommand(null, user, post);
    const updatedPost = await this._commandBus.execute(editPostCommand);
    return Result.ok(updatedPost, { messages: ["Edit post successfully"] });
  }

  @Post(":postId/react")
  async reactPost(
    @User() user: UserDTO,
    @Body() body: ReactPostRequest,
    @Param("postId", ParseObjectIdPipe) postId: string
  ) {
    body.postId = postId;
    const reactCommand = new ReactPostCommand(null, user, body);
    const result = await this._commandBus.execute(reactCommand);
    return Result.ok(result, {
      messages: ["Update react status successfully"],
    });
  }
}
