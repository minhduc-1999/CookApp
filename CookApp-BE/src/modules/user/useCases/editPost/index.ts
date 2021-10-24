import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import {
  UpdatePostDTO,
} from "modules/user/dtos/post.dto";
import { UserDTO } from "modules/user/dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";

export class EditPostCommand implements ICommand {
  author: UserDTO;
  postDto: UpdatePostDTO;
  constructor(author: UserDTO, post: UpdatePostDTO) {
    this.author = author;
    this.postDto = post;
  }
}

@CommandHandler(EditPostCommand)
export class EditPostCommandHandler
  implements ICommandHandler<EditPostCommand> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService
  ) {}
  async execute(command: EditPostCommand): Promise<boolean> {
    return this._postService.editPost(command.postDto, command.author);
  }
}
