import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Album, Moment, Post } from "domains/social/post.domain";
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MediaType } from "enums/social.enum";
export class EditPostCommand extends BaseCommand {
  req: EditPostRequest;
  constructor(tx: ITransaction, user: User, post: EditPostRequest) {
    super(tx, user);
    this.req = Object.assign(new EditPostRequest(), post);
  }
}

@CommandHandler(EditPostCommand)
export class EditPostCommandHandler
  implements ICommandHandler<EditPostCommand> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) { }
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

    // Delete images
    if (req.deleteImages && req.deleteImages.length > 0) {
      // await this._mediaRepository.setTransaction(tx).deleteMedias(deleteImageKeys)
      req.deleteImages = await this._storageService.deleteFiles(req.deleteImages);
    }

    // Add new images
    if (req.addImages && req.addImages.length > 0) {
      const keys = await this._storageService.makePublic(
        command.req.addImages,
        MediaType.IMAGE
      );
      req.addImages = keys
      // await this._mediaRepository.setTransaction(tx).addMedias(keys, MediaType.POST_IMAGE)
    }

    let updateData: Post;
    switch (existedPost.kind) {
      case "Album":
        updateData = new Album({
          id: req.id,
          name: req.name,
          images: req.addImages.map(image => new Image({ key: image }))
        })
        break;
      case "Moment":
        updateData = new Moment({
          id: req.id,
          content: req.content,
          images: req.addImages.map(image => new Image({ key: image }))
        })
        break;
    }

    await this._postRepo.setTransaction(tx).updatePost(updateData, req);
    return new EditPostResponse();
  }
}
