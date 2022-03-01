import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post as PostHttp } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostCommand } from "modules/user/useCases/createPost";
import { CreatePostRequest } from "modules/user/useCases/createPost/createPostRequest";
import { CreatePostResponse } from "modules/user/useCases/createPost/createPostResponse";
import { EditPostCommand } from "modules/user/useCases/editPost";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { EditPostResponse } from "modules/user/useCases/editPost/editPostResponse";
import { GetPostDetailQuery } from "modules/user/useCases/getPostById";
import { GetPostResponse } from "modules/user/useCases/getPostById/getPostResponse";
import { SavePostCommand } from "modules/user/useCases/savePost";
import { SavePostRequest } from "modules/user/useCases/savePost/savePostReponse";
import { Transaction } from "neo4j-driver";

@Controller("users/posts")
@ApiTags("User/Post")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @PostHttp()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreatePostResponse, "Create post successfully")
  @RequestTransaction()
  async createPost(
    @Body() post: CreatePostRequest,
    @UserReq() user: User,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<Post>> {
    const createPostCommand = new CreatePostCommand(user, post, tx);
    const createdPost = await this._commandBus.execute(createPostCommand);
    return Result.ok(createdPost, { messages: ["Create post successfully"] });
  }

  @Get(":postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetPostResponse, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
  async getPostById(
    @Param("postId", ParseUUIDPipe) postId: string,
    @UserReq() user: User
  ): Promise<Result<GetPostResponse>> {
    const query = new GetPostDetailQuery(user, postId);
    const post = await this._queryBus.execute(query);
    return Result.ok(post, { messages: ["Get post successfully"] });
  }

  @Patch(":postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(EditPostResponse, "Edit post successfully")
  @RequestTransaction()
  async editPost(
    @Body() post: EditPostRequest,
    @UserReq() user: User,
    @Param("postId", ParseUUIDPipe) postId: string,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<EditPostResponse>> {
    post.id = postId;
    const editPostCommand = new EditPostCommand(tx, user, post);
    const updatedPost = await this._commandBus.execute(editPostCommand);
    return Result.ok(updatedPost, { messages: ["Edit post successfully"] });
  }

  @PostHttp(":postId/save")
  @RequestTransaction()
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Save post successfully")
  async reactPost(
    @UserReq() user: User,
    @Param("postId", ParseUUIDPipe) postID: string,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<void>> {
    const savePostReq = new SavePostRequest(postID)
    const savePostCommand = new SavePostCommand(savePostReq, user, tx);
    await this._commandBus.execute(savePostCommand);
    return Result.ok(null, {
      messages: ["Save post successfully"],
    });
  }
}
