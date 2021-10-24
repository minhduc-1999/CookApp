import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiBadReqResponseCustom,
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import {
  CreatePostDTO,
  PostDTO,
  UpdatePostDTO,
} from "modules/user/dtos/post.dto";
import { CreatePostCommand } from "modules/user/useCases/createPost";
import { EditPostCommand } from "modules/user/useCases/editPost";
import { GetPostDetailQuery } from "modules/user/useCases/getPostById";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";

@Controller("/users/posts")
@ApiTags("User")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post()
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(PostDTO, "Create post successfully")
  async createPost(
    @Body() post: CreatePostDTO,
    @Req() req
  ): Promise<Result<PostDTO>> {
    const createPostCommand = new CreatePostCommand(req.user, post);
    const createdPost = await this._commandBus.execute(createPostCommand);
    return Result.ok(createdPost, { messages: ["Create post successfully"] });
  }

  @Get(":postId")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(PostDTO, "Get post successfully")
  @ApiNotFoundResponse({ description: "Post not found" })
  async getPostById(
    @Param("postId", ParseObjectIdPipe) postId: string,
    @Req() req
  ): Promise<Result<PostDTO>> {
    const query = new GetPostDetailQuery(req.user, postId);
    const post = await this._queryBus.execute(query);
    return Result.ok(post, { messages: ["Get post successfully"] });
  }

  @Patch(":postId")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom()
  @ApiCreatedResponseCustom(Object, "Edit post successfully")
  async editPost(
    @Body() post: UpdatePostDTO,
    @Req() req,
    @Param("postId", ParseObjectIdPipe) postId: string
  ): Promise<Result<any>> {
    post.id = postId;
    const editPostCommand = new EditPostCommand(req.user, post);
    await this._commandBus.execute(editPostCommand);
    return Result.ok({}, { messages: ["Edit post successfully"] });
  }
}
