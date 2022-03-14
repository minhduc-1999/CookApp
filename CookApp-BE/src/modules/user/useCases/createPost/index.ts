import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Album, Moment, Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { NewPostEvent } from "modules/notification/events/NewPostNotification";
import { ResponseDTO } from "base/dtos/response.dto";
import { Image, Video } from "domains/social/media.domain";

export class CreatePostCommand extends BaseCommand {
  req: CreatePostRequest;
  constructor(user: User, post: CreatePostRequest, tx: Transaction) {
    super(tx, user);
    this.req = post;
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
    private _eventBus: EventBus,
  ) { }
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { req, user, tx } = command;
    if (req.images?.length > 0) {
      req.images = await this._storageService.makePublic(
        req.images,
        MediaType.POST_IMAGE
      );
    }

    let creatingPost: Post

    switch (req.kind) {
      case "Album": {
        creatingPost = new Album({
          author: user,
          name: req.name,
          images: req.images?.map(image => new Image({key: image})),
          videos: req.videos?.map(video => new Video({key: video}))
        })
        break;
      }
      case "Moment": {
        creatingPost = new Moment({
          author: user,
          content: req.content,
          images: req.images?.map(image => new Image({key: image})),
          videos: req.videos?.map(video => new Video({key: video}))
        });
      }
      default: {
        break;
      }
    }

    if (!creatingPost.canCreate()) {
      throw new BadRequestException(ResponseDTO.fail("Not enough data to create the post"))
    }

    const result = await this._postRepo.setTransaction(tx).createPost(creatingPost);
    result.images = await this._storageService.getDownloadUrls(result.images)
    if (req.kind === "Moment") {
      this._eventBus.publish(new NewPostEvent(result, user))
    }
    return new CreatePostResponse(result);
  }
}
