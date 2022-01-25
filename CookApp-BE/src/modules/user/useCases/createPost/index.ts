import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { NewPostEvent } from "modules/notification/usecases/NewPostNotification";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";

export class CreatePostCommand extends BaseCommand {
  post: CreatePostRequest;
  constructor(user: UserDTO, post: CreatePostRequest, tx: Transaction) {
    super(tx, user);
    this.post = post;
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
    private _eventBus: EventBus
  ) { }
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { post, user, tx } = command;

    if (post.images?.length > 0) {
      post.images = await this._storageService.makePublic(
        post.images,
        MediaType.POST_IMAGES
      );
    }
    const creatingPost = new PostDTO({
      ...post,
      author: user,
    });
    const result = await this._postRepo.setTransaction(tx).createPost(creatingPost);

    // push posts to followers
    // const followers = await this._wallRepo.getFollowers(user.id);
    // followers.forEach(async (follower) => {
    //   tasks.push(this._feedRepo.pushNewPost(result, follower));
    // });

    result.images = await this._storageService.getDownloadUrls(result.images);
    this._eventBus.publish(new NewPostEvent(result, user))
    return result;
  }
}
