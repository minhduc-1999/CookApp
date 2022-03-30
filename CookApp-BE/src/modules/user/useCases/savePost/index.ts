import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
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
    @Inject("ISavedPostRepository")
    private _savedPostRepo: ISavedPostRepository,
  ) { }
  async execute(command: SavePostCommand): Promise<void> {
    const { savePostDto, tx, user } = command

    const post  = await this._postRepo.getPostById(savePostDto.postID)

    const saved = await this._savedPostRepo.find(savePostDto.postID, user.id)
    if (saved) {
      throw new ConflictException(ResponseDTO.fail("Post have been saved already", UserErrorCode.POST_SAVED_ALREADY))
    }

    const item = user.savePost(post)
    await this._savedPostRepo.setTransaction(tx).savePost(item)
  }
}
