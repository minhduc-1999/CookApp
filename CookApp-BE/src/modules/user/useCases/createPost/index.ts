import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IPostRepository } from "modules/user/adapters/out/post.repository";
import { PostDTO } from "modules/user/dtos/post.dto";
import { UserDTO } from "modules/user/dtos/user.dto";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";

export class CreatePostCommand implements ICommand {
  author: UserDTO;
  postDto: CreatePostRequest;
  constructor(author: UserDTO, post: CreatePostRequest) {
    this.author = author;
    this.postDto = post;
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject('IPostRepository')
    private _postRepo: IPostRepository
  ) {}
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const creatingPost = new PostDTO({...command.postDto, author: command.author})
    const result = await this._postRepo.createPost(creatingPost);
    return new CreatePostResponse(result);
  }
}
