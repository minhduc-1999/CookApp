import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { UserDTO } from "dtos/social/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { createUpdatingObject, retrieveObjectNameFromUrl } from "utils";
import { EditPostRequest } from "./editPostRequest";
import { EditPostResponse } from "./editPostResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ConfigService } from "nestjs-config";
import { MediaType } from "enums/mediaType.enum";
export class EditPostCommand extends BaseCommand {
  postDto: EditPostRequest;
  constructor(session: ClientSession, user: UserDTO, post: EditPostRequest) {
    super(session, user);
    this.postDto = post;
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
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    private _configService: ConfigService
  ) {}
  async execute(command: EditPostCommand): Promise<EditPostResponse> {
    const { user, postDto } = command;
    const existedPost = await this._postService.getPostDetail(postDto.id);

    if (existedPost.author.id !== user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          ErrorCode.INVALID_OWNER
        )
      );

    // const deletedResult = await this._storageService.deleteFiles([
    //   "images\\posts\\61a1c2f8493ba21f434f7a71_1638036969077_salad.png",
    //   "temp\\619b6fc1c99dd48c2aec7ac6_1637592003945_salad.png",
    // ]);
    // const addResult = await this._storageService.makePublic(
    //   command.postDto.addImages,
    //   MediaType.POST_IMAGES
    // );

    // await Promise.all([
    //   this._postRepo.deleteImages(command.postDto.id, deletedResult),
    //   this._postRepo.pushImages(command.postDto.id, addResult),
    // ]);

    // const images = existedPost.images.filter(
    //   (image) => !deletedResult.includes(image)
    // );
    // // const images = [];
    // images.push(...addResult);

    delete postDto.addImages;
    delete postDto.deleteImages;

    const updatePost = createUpdatingObject({ ...postDto }, user.id);
    const updatedResult = await this._postRepo.updatePost(updatePost);
    await Promise.all([
      this._wallRepo.updatePostInWall(updatedResult, user),
      this._feedRepo.updatePostInFeed(updatedResult, user),
    ]);
    return updatedResult;
  }
}
