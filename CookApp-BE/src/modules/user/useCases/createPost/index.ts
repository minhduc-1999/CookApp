import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IPostRepository } from "modules/user/adapters/out/post.repository";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { WallDTO } from "dtos/wall.dto";
import { IWallRepository } from "modules/user/adapters/out/wall.repository";

export class CreatePostCommand extends BaseCommand{
  postDto: CreatePostRequest;
  constructor(user: UserDTO, post: CreatePostRequest, session?: ClientSession) {
    super(session, user)
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
    private _storageService: IStorageService,
    @Inject('IWallRepository')
    private _wallRepo: IWallRepository
  ) {}
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { postDto, user } = command;
    
    if (postDto.images?.length > 0) {
      postDto.images = await this._storageService.makePublic(
        postDto.images,
        MediaType.POST_IMAGES
      );
    }
    const creatingPost = new PostDTO({
      ...postDto,
      author: user,
      createdBy: user.id,
      updatedBy: user.id,
    });
    const result = await this._postRepo.createPost(creatingPost, command.session);
    delete result['author']
    await this._wallRepo.pushNewPost(result, user)
    return new CreatePostResponse(result);
  }
}
