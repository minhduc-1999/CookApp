import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostDTO, PostDTO } from "modules/user/dtos/post.dto";
import { UserDTO } from "modules/user/dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";

export class CreatePostCommand implements ICommand {
  author: UserDTO;
  postDto: CreatePostDTO;
  constructor(author: UserDTO, post: CreatePostDTO) {
    this.author = author;
    this.postDto = post;
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService
  ) {}
  async execute(command: CreatePostCommand): Promise<PostDTO> {
    return this._postService.createPost(command.postDto, command.author);
  }
}
