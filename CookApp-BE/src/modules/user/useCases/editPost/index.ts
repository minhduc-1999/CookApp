import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { retrieveObjectNameFromUrl } from "utils";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { ConfigService } from "nestjs-config";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { MediaType } from "enums/mediaType.enum";
export class EditPostCommand extends BaseCommand {
  editPostDto: EditPostRequest;
  constructor(tx: Transaction, user: User, post: EditPostRequest) {
    super(tx, user);
    this.editPostDto = Object.assign(new EditPostRequest(), post);
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
    private _configService: ConfigService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) { }
  async execute(command: EditPostCommand): Promise<EditPostResponse> {
    const { user, tx, editPostDto } = command;
    const existedPost = await this._postService.getPostDetail(editPostDto.id);

    if (existedPost.author.id !== user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          UserErrorCode.INVALID_OWNER
        )
      );

    // Convert delete image urls to image key
    const deleteImageKeys = editPostDto.deleteImages ? editPostDto.deleteImages.map(url => {
      return retrieveObjectNameFromUrl(
        url,
        this._configService.get("storage.publicUrl")
      )
    }) : []

    // Delete images
    if (editPostDto.deleteImages && editPostDto.deleteImages.length > 0) {
      // await this._mediaRepository.setTransaction(tx).deleteMedias(deleteImageKeys)
      await this._storageService.deleteFiles(deleteImageKeys);
      editPostDto.deleteImages = deleteImageKeys
    }

    // Add new images
    if (editPostDto.addImages && editPostDto.addImages.length > 0) {
      const keys = await this._storageService.makePublic(
        command.editPostDto.addImages,
        MediaType.POST_IMAGE
      );
      editPostDto.addImages = keys
      // await this._mediaRepository.setTransaction(tx).addMedias(keys, MediaType.POST_IMAGE)
    }

     await this._postRepo.setTransaction(tx).updatePost(editPostDto.toUpdateDomain(existedPost), editPostDto);
    return new EditPostResponse();
  }
}
