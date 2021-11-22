import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { UserDTO } from "dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { createUpdatingObject } from "utils";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
export class EditPostCommand extends BaseCommand {
  postDto: EditPostRequest;
  constructor(session: ClientSession, user: UserDTO, post: EditPostRequest) {
    super(session, user);
    this.postDto = post;
  }
}

@CommandHandler(EditPostCommand)
export class EditPostCommandHandler
  implements ICommandHandler<EditPostCommand> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository
  ) {}
  async execute(command: EditPostCommand): Promise<EditPostResponse> {
    const { user, postDto } = command;
    const existedPost = await this._postService.getPostDetail(postDto.id);

    if (existedPost.author.id !== user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          ErrorCode.INVALID_OWNER
        )
      );
    const updatePost = createUpdatingObject(postDto, user.id);
    const updatedResult = await this._postRepo.updatePost(updatePost);
    await Promise.all([
      this._wallRepo.updatePostInWall(updatedResult, user),
      this._feedRepo.updatePostInFeed(updatedResult, user),
    ]);
    return updatedResult;
  }
}
