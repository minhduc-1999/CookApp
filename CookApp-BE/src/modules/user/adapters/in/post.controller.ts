import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import { classToPlain, plainToClass } from "class-transformer";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
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
import { GetWallPostsQuery } from "modules/user/useCases/getWallPosts";
import { GetWallPostsResponse } from "modules/user/useCases/getWallPosts/getWallPostsResponse";
import { ClientSession } from "mongoose";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";
import { clean } from "utils";

@Controller("users")
@ApiTags("User/Post")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post("posts")
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

  @Get("posts/:postId")
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

  @Patch("posts/:postId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(EditPostResponse, "Edit post successfully")
  async editPost(
    @Body() post: EditPostRequest,
    @User() user: UserDTO,
    @Param("postId", ParseObjectIdPipe) postId: string
  ): Promise<Result<EditPostResponse>> {
    post.id = postId;
    const editPostCommand = new EditPostCommand(null, user, post);
    const updatedPost = await this._commandBus.execute(editPostCommand);
    return Result.ok(updatedPost, { messages: ["Edit post successfully"] });
  }
}
