import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { NewPostEvent } from "modules/notification/usecases/NewPostNotification";
import { Transaction } from "neo4j-driver";

export class CreatePostCommand extends BaseCommand {
  postDto: CreatePostRequest;
  constructor(user: UserDTO, post: CreatePostRequest, tx: Transaction) {
    super(tx, user);
    this.postDto = post;
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    private _eventBus: EventBus
  ) { }
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { postDto, user } = command;

    if (postDto.images?.length > 0) {
      postDto.images = await this._storageService.makePublic(
        postDto.images,
        MediaType.POST_IMAGES
      );
    }
    const tasks = [];
    const creatingPost = PostDTO.create({
      ...postDto,
      author: user,
    });
    const result = await this._postRepo.createPost(creatingPost);

    // tasks.push(
    //   this._feedRepo.pushNewPost(result, user.id),
    //   this._wallRepo.pushNewPost(result, user)
    // );

    // push posts to followers
    const followers = await this._wallRepo.getFollowers(user.id);
    followers.forEach(async (follower) => {
      tasks.push(this._feedRepo.pushNewPost(result, follower));
    });

    // waiting for all tasks
    await Promise.all(tasks);

    result.images = await this._storageService.getDownloadUrls(result.images);
    this._eventBus.publish(new NewPostEvent(result, user))
    return result;
  }
}
