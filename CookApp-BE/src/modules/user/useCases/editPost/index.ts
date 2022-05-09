import { ForbiddenException, Inject } from "@nestjs/common";
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
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MediaType } from "enums/social.enum";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
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
    private _postMediaRepo: IPostMediaRepository
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

    let deleteMedias = await this._postMediaRepo.getMedias(req.deleteImages);

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

    let updateData: Partial<Post> = existedPost.update({
      ...req,
      medias: req.addImages?.map((image) => new Image({ key: image })),
    });

    await this._postService.updatePost(
      existedPost,
      updateData,
      tx,
      deleteMedias?.map((media) => media.id)
    );
    return new EditPostResponse();
  }
}
