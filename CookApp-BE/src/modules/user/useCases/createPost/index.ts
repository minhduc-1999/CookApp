import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Moment, Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { Image, Video } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import _ = require("lodash");
import { IPostService } from "modules/user/services/post.service";
import { NewPostEvent } from "modules/notification/events/NewPostNotification";
import { MediaType, PostType } from "enums/social.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";

export class CreatePostCommand extends BaseCommand {
  req: CreatePostRequest;
  constructor(user: User, post: CreatePostRequest, tx: ITransaction) {
    super(tx, user);
    this.req = post;
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    private _eventBus: EventBus,
  ) { }
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { req, user, tx } = command;

    if (req.images?.length > 0) {
      req.images = await this._storageService.makePublic(
        req.images,
        MediaType.IMAGE
      );
    }

    if (req.videos?.length > 0) {
      req.videos = await this._storageService.makePublic(
        req.images,
        MediaType.VIDEO
      );
    }

    let creatingPost: Post

    const medias = _.unionBy(
      req.images?.map(image => new Image({ key: image })),
      req.videos?.map(video => new Video({ key: video })),
      'key'
    )

    switch (req.kind) {
      case PostType.MOMENT: {
        creatingPost = new Moment({
          author: user,
          content: req.content,
          medias,
          location: req.location,
        });
      }
      default: {
        break;
      }
    }

    if (!creatingPost.canCreate()) {
      throw new BadRequestException(ResponseDTO.fail("Not enough data to create the post"))
    }

    const result = await this._postService.createPost(creatingPost, tx);
    if (req.kind === "MOMENT") {
      this._eventBus.publish(new NewPostEvent(result, user))
    }
    return new CreatePostResponse(result);
  }
}
