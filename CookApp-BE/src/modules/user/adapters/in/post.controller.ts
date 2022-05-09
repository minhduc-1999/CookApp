import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post as PostHttp,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
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
import { GetPostDetailQuery } from "modules/user/useCases/getPostDetail";
import { GetPostResponse } from "modules/user/useCases/getPostDetail/getPostResponse";
import { GetSavedPostsQuery } from "modules/user/useCases/getSavedPosts";
import { GetSavedPostsResponse } from "modules/user/useCases/getSavedPosts/getSavedPostsResponse";
import { SavePostCommand } from "modules/user/useCases/savePost";
import { SavePostRequest } from "modules/user/useCases/savePost/savePostRequest";
import { ParseCreatePostRequestPipe } from "pipes/parsePostRequest.pipe";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users/posts")
@ApiTags("User/Post")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @PostHttp()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreatePostResponse, "Create post successfully")
  @HttpRequestTransaction()
  async createPost(
    @Body(ParseCreatePostRequestPipe) post: CreatePostRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<Post>> {
    const createPostCommand = new CreatePostCommand(user, post, tx);
    const createdPost = await this._commandBus.execute(createPostCommand);
    return Result.ok(createdPost, { messages: ["Create post successfully"] });
  }

  @Get(":postId/detail")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetPostResponse, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
  async getPostById(
    @Param("postId", ParseUUIDPipe) postId: string,
    @HttpUserReq() user: User
  ): Promise<Result<GetPostResponse>> {
    const query = new GetPostDetailQuery(user, postId);
    const post = await this._queryBus.execute(query);
    return Result.ok(post, { messages: ["Get post successfully"] });
  }

  @Patch(":postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(EditPostResponse, "Edit post successfully")
  @HttpRequestTransaction()
  @ApiNotFoundResponse({ description: "Post not found" })
  async editPost(
    @Body() post: EditPostRequest,
    @HttpUserReq() user: User,
    @Param("postId", ParseUUIDPipe) postId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<EditPostResponse>> {
    post.id = postId;
    const editPostCommand = new EditPostCommand(tx, user, post);
    const updatedPost = await this._commandBus.execute(editPostCommand);
    return Result.ok(updatedPost, { messages: ["Edit post successfully"] });
  }

  @PostHttp(":postId/save")
  @HttpRequestTransaction()
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Save post successfully")
  @ApiConflictResponse({ description: "Post have been saved already" })
  @ApiNotFoundResponse({ description: "Post not found" })
  async savePost(
    @HttpUserReq() user: User,
    @Param("postId", ParseUUIDPipe) postID: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const savePostReq = new SavePostRequest(postID);
    const savePostCommand = new SavePostCommand(savePostReq, user, tx);
    await this._commandBus.execute(savePostCommand);
    return Result.ok(null, {
      messages: ["Save post successfully"],
    });
  }

  @Delete(":postId/save")
  @HttpRequestTransaction()
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete saved post successfully")
  @ApiConflictResponse({ description: "Post have not been saved yet" })
  @ApiNotFoundResponse({ description: "Post not found" })
  async deleteSavedPost(
    @HttpUserReq() user: User,
    @Param("postId", ParseUUIDPipe) postID: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const dto = new DeleteSavedPostRequest(postID);
    const deleteSavedPostCommand = new DeleteSavedPostCommand(dto, user, tx);
    await this._commandBus.execute(deleteSavedPostCommand);
    return Result.ok(null, {
      messages: ["Delete saved post successfully"],
    });
  }

  @Get("save")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetSavedPostsResponse, "Get saved posts successfully")
  async getSavedPosts(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetSavedPostsResponse>> {
    const savedPostsQuery = new GetSavedPostsQuery(user, query);
    const result = await this._queryBus.execute(savedPostsQuery);
    return Result.ok(result, {
      messages: ["Get saved posts successfully"],
    });
  }
}
