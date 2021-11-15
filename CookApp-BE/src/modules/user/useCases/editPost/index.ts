import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import {} from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { createUpdatingObject } from "utils";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
export class EditPostCommand extends BaseCommand {
  postDto: EditPostRequest;
  constructor(session: ClientSession, user: UserDTO, post: EditPostRequest) {
    super(session, user)
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
    private _postRepo: IPostRepository
  ) {}
  async execute(command: EditPostCommand): Promise<EditPostResponse> {
    const existedPost = await this._postService.getPostDetail(
      command.postDto.id
    );

    if (existedPost.author.id !== command.user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          ErrorCode.INVALID_OWNER
        )
      );
    const updatedPost = createUpdatingObject(command.postDto, command.user.id);
    return this._postRepo.updatePost(updatedPost);
  }
}
