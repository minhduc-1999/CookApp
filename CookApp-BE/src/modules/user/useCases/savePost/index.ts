import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { SavedPost } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IPostService } from "modules/user/services/post.service";
import { SavePostRequest } from "./savePostRequest"

export class SavePostCommand extends BaseCommand {
  savePostDto: SavePostRequest
  constructor(savePostDto: SavePostRequest, user: User, tx: ITransaction) {
    super(tx, user)
    this.savePostDto = savePostDto
  }
}

@CommandHandler(SavePostCommand)
export class SavePostCommandHandler implements ICommandHandler<SavePostCommand> {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IPostService")
    private _postService: IPostService
  ) { }
  async execute(command: SavePostCommand): Promise<void> {
    const { savePostDto, tx, user } = command

    const [ existedPost ] = await this._postService.getPostDetail(savePostDto.postID)

    const isSaved = await this._postRepo.isSavedPost(savePostDto.postID, user)
    if (isSaved) {
      throw new ConflictException(ResponseDTO.fail("Post have been saved already", UserErrorCode.POST_SAVED_ALREADY))
    }

    const savedPost = new SavedPost({
      post: existedPost,
      saver: user
    })

    await this._postRepo.setTransaction(tx).savePost(savedPost)
  }
}
