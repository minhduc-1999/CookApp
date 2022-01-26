import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { NewPostEvent } from "modules/notification/usecases/NewPostNotification";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";

export class CreatePostCommand extends BaseCommand {
  post: CreatePostRequest;
  constructor(user: User, post: CreatePostRequest, tx: Transaction) {
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
        MediaType.POST_IMAGE
      );
    }
    const creatingPost = new Post({
      ...post,
      author: user,
    });
    const result = await this._postRepo.setTransaction(tx).createPost(creatingPost);

    result.images = await this._storageService.getDownloadUrls(result.images);
    this._eventBus.publish(new NewPostEvent(result, user))
    return result;
  }
}
