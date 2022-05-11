import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Post } from "domains/social/post.domain";
import { Image, PostMedia } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MediaType, PostType } from "enums/social.enum";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { Food } from "domains/core/food.domain";
export class EditPostCommand extends BaseCommand {
  req: EditPostRequest;
  constructor(tx: ITransaction, user: User, post: EditPostRequest) {
    super(tx, user);
    this.req = Object.assign(new EditPostRequest(), post);
  }
}

@CommandHandler(EditPostCommand)
export class EditPostCommandHandler
  implements ICommandHandler<EditPostCommand>
{
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(command: EditPostCommand): Promise<EditPostResponse> {
    const { user, tx, req } = command;
    const [existedPost] = await this._postService.getPostDetail(req.id);

    if (existedPost.author.id !== user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          UserErrorCode.INVALID_OWNER
        )
      );

    let deleteMedias: PostMedia[];

    const updateMediaFn = async () => {
      deleteMedias = await this._postMediaRepo.getMedias(req.deleteImages);

      // Delete images
      if (req.deleteImages?.length > 0) {
        deleteMedias = await this._storageService.deleteFiles(deleteMedias);
      }

      // Add new images
      if (req.addImages && req.addImages.length > 0) {
        const keys = await this._storageService.makePublic(
          command.req.addImages,
          MediaType.IMAGE,
          "post"
        );
        req.addImages = keys;
      }
    };

    let updateData: Partial<Post>;

    switch (existedPost.type) {
      case PostType.FOOD_SHARE:
        await updateMediaFn();
        let newFoodRef: Food;
        if (req.foodRefId) {
          newFoodRef = await this._foodRepo.getById(req.foodRefId);
          if (!newFoodRef)
            throw new NotFoundException(
              ResponseDTO.fail(
                "Reference food not found",
                UserErrorCode.FOOD_NOT_FOUND
              )
            );
        }

        updateData = existedPost.update({
          ...req,
          ref: newFoodRef,
          medias: req.addImages?.map((image) => new Image({ key: image })),
        });
        break;
      case PostType.MOMENT:
        await updateMediaFn();
        updateData = existedPost.update({
          ...req,
          medias: req.addImages?.map((image) => new Image({ key: image })),
        });
        break;
      case PostType.RECOMMENDATION:
        let newShouldFoods: Food[];
        let newShouldNotFoods: Food[];

        if (req.shouldFoodIds) {
          newShouldFoods = await this._foodRepo.getByIds(req.shouldFoodIds);
          if (!newShouldFoods || newShouldFoods.length === 0)
            throw new NotFoundException(
              ResponseDTO.fail(`All foods in "should" session not found`)
            );
        }

        if (req.shouldNotFoodIds) {
          newShouldNotFoods = await this._foodRepo.getByIds(
            req.shouldNotFoodIds
          );
          if (!newShouldNotFoods || newShouldNotFoods.length === 0)
            throw new NotFoundException(
              ResponseDTO.fail(`All foods in "should not" session not found`)
            );
        }

        updateData = existedPost.update({
          ...req,
          recommendation: {
            should: {
              advice: req.shouldAdvice,
              foods: newShouldFoods,
            },
            shouldNot: {
              advice: req.shouldNotAdvice,
              foods: newShouldNotFoods,
            },
          },
        });
        break;
    }

    await this._postService.updatePost(
      existedPost,
      updateData,
      tx,
      deleteMedias?.map((media) => media.id)
    );
    return new EditPostResponse();
  }
}
