import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import {
  FoodShare,
  Moment,
  Post,
  Recommendation,
  RecommendationItem,
  RecommendationPost,
} from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { CreatePostRequest } from "./createPostRequest";
import { CreatePostResponse } from "./createPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { Image, Media, Video } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import _ = require("lodash");
import { IPostService } from "modules/user/services/post.service";
import { MediaType, PostType } from "enums/social.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Food } from "domains/core/food.domain";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { UserErrorCode } from "enums/errorCode.enum";
import { PostCreatedEvent } from "domains/social/events/post.event";

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
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    private _eventBus: EventBus
  ) {}
  async execute(command: CreatePostCommand): Promise<CreatePostResponse> {
    const { req, user, tx } = command;

    let creatingPost: Post;
    let medias: Media[] = [];
    if (req.kind === PostType.MOMENT || req.kind === PostType.FOOD_SHARE) {
      if (req.images?.length > 0) {
        req.images = await this._storageService.makePublic(
          req.images,
          MediaType.IMAGE,
          "post"
        );
      }

      if (req.videos?.length > 0) {
        req.videos = await this._storageService.makePublic(
          req.images,
          MediaType.VIDEO,
          "post"
        );
      }

      medias = _.unionBy(
        req.images?.map((image) => new Image({ key: image })),
        req.videos?.map((video) => new Video({ key: video })),
        "key"
      );
    }

    switch (req.kind) {
      case PostType.MOMENT: {
        creatingPost = new Moment({
          author: user,
          content: req.content,
          medias,
          location: req.location,
          tags: req.tags,
        });
        break;
      }
      case PostType.FOOD_SHARE: {
        let foodRef: Food;
        if (req.foodRefId) {
          foodRef = await this._foodRepo.getById(req.foodRefId);
          if (!foodRef)
            throw new NotFoundException(
              ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
            );
        }
        creatingPost = new FoodShare({
          author: user,
          content: req.content,
          medias,
          ref: foodRef,
          tags: req.tags,
          location: req.location,
        });
        break;
      }
      case PostType.RECOMMENDATION:
        const userPermissions =
          user?.account?.role?.permissions.map((p) => p.sign) ?? [];
        if (
          userPermissions.length === 0 ||
          !userPermissions.includes("create_recommendation_post")
        )
          throw new ForbiddenException();
        const shouldFoods = await this._foodRepo.getByIds(req.should.foodIds);
        if (!shouldFoods || shouldFoods.length === 0)
          throw new NotFoundException(
            ResponseDTO.fail(`All foods in "should" session not found`)
          );
        const shouldNotFoods = await this._foodRepo.getByIds(
          req.shouldNot.foodIds
        );
        if (!shouldNotFoods || shouldNotFoods.length === 0)
          throw new NotFoundException(
            ResponseDTO.fail(`All foods in "should not" session not found`)
          );
        const shouldRecommendItem: RecommendationItem = {
          advice: req.should.advice,
          foods: shouldFoods,
        };
        const shouldNotRecommendItem: RecommendationItem = {
          advice: req.shouldNot.advice,
          foods: shouldNotFoods,
        };
        creatingPost = new RecommendationPost({
          recommendation: new Recommendation(
            shouldRecommendItem,
            shouldNotRecommendItem
          ),
          tags: req.tags,
          author: user,
          content: req.content,
        });
        break;
      default: {
        break;
      }
    }

    if (!creatingPost || !creatingPost.canCreate()) {
      throw new BadRequestException(
        ResponseDTO.fail("Not enough data to create the post")
      );
    }

    const result = await this._postService.createPost(creatingPost, tx);
    this._eventBus.publish(new PostCreatedEvent(result, user));
    return new CreatePostResponse(result);
  }
}
