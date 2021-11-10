import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/adapters/out/post.repository";
import {} from "modules/user/dtos/post.dto";
import { UserDTO } from "modules/user/dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { createUpdatingObject } from "utils";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
export class EditPostCommand implements ICommand {
  author: UserDTO;
  postDto: EditPostRequest;
  constructor(author: UserDTO, post: EditPostRequest) {
    this.author = author;
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

    if (existedPost.author.id !== command.author.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          ErrorCode.INVALID_OWNER
        )
      );
    const updatedPost = createUpdatingObject(command.postDto, command.author.id);
    return this._postRepo.updatePost(updatedPost);
  }
}
