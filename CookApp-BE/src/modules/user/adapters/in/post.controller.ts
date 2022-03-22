import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post as PostHttp, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostCommand } from "modules/user/useCases/createPost";
import { CreatePostRequest } from "modules/user/useCases/createPost/createPostRequest";
import { CreatePostResponse } from "modules/user/useCases/createPost/createPostResponse";
import { DeleteSavedPostCommand } from "modules/user/useCases/deleteSavedPost";
import { DeleteSavedPostRequest } from "modules/user/useCases/deleteSavedPost/deleteSavedPostRequest";
import { EditPostCommand } from "modules/user/useCases/editPost";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { EditPostResponse } from "modules/user/useCases/editPost/editPostResponse";
import { GetPostDetailQuery } from "modules/user/useCases/getPostById";
import { GetPostResponse } from "modules/user/useCases/getPostById/getPostResponse";
import { GetSavedPostsQuery } from "modules/user/useCases/getSavedPosts";
import { GetSavedPostsResponse } from "modules/user/useCases/getSavedPosts/getSavedPostsResponse";
import { SavePostCommand } from "modules/user/useCases/savePost";
import { SavePostRequest } from "modules/user/useCases/savePost/savePostRequest";
import { Transaction } from "neo4j-driver";
import { ParseRequestPipe } from "pipes/parseRequest.pipe";

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

  @Get(":postId/detail")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetPostResponse, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
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
  @ApiNotFoundResponse({ description: "Post not found" })
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
  @ApiConflictResponse({ description: "Post have been saved already" })
  @ApiNotFoundResponse({ description: "Post not found" })
  async savePost(
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


  @Delete(":postId/save")
  @RequestTransaction()
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete saved post successfully")
  @ApiConflictResponse({ description: "Post have not been saved yet" })
  @ApiNotFoundResponse({ description: "Post not found" })
  async deleteSavedPost(
    @UserReq() user: User,
    @Param("postId", ParseUUIDPipe) postID: string,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<void>> {
    const dto = new DeleteSavedPostRequest(postID)
    const deleteSavedPostCommand = new DeleteSavedPostCommand(dto, user, tx);
    await this._commandBus.execute(deleteSavedPostCommand);
    return Result.ok(null, {
      messages: ["Delete saved post successfully"],
    });
  }

  @Get('save')
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetSavedPostsResponse,
    "Get saved posts successfully"
  )
  async getSavedPosts(
    @Query(new ParseRequestPipe<typeof PageOptionsDto>()) query: PageOptionsDto,
    @UserReq() user: User
  ): Promise<Result<GetSavedPostsResponse>> {
    const savedPostsQuery = new GetSavedPostsQuery(user, query);
    const result = await this._queryBus.execute(savedPostsQuery);
    return Result.ok(result, {
      messages: ["Get saved posts successfully"],
    });
  }
}
