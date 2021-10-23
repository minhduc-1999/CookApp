import { Body, Controller, Post, Req, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiBadReqResponseCustom,
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { CreatePostDTO, PostDTO } from "modules/user/dtos/post.dto";
import { CreatePostCommand } from "modules/user/useCases/createPost";

@Controller("posts")
@ApiTags("User")
@ApiBearerAuth()
export class PostController {
  constructor(private _commandBus: CommandBus) {}

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
    return Result.ok(createdPost, { message: "Create post successfully" });
  }
}
