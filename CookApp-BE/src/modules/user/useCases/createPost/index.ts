import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import storage from "config/storage";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
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
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { postDto } = command;
    
    if (postDto.images?.length > 0) {
      postDto.images = await this._storageService.makePublic(
        postDto.images,
        MediaType.POST_IMAGES
      );
    }
    const creatingPost = new PostDTO({
      ...postDto,
      author: command.author,
    });
    const result = await this._postRepo.createPost(creatingPost);
    return new CreatePostResponse(result);
  }
}
