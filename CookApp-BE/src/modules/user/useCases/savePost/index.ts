import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { Transaction } from "neo4j-driver";
import { SavePostRequest } from "./savePostRequest"

export class SavePostCommand extends BaseCommand {
  savePostDto: SavePostRequest
  constructor(savePostDto: SavePostRequest, user: User, tx: Transaction) {
    super(tx, user)
    this.savePostDto = savePostDto
  }
}

@CommandHandler(SavePostCommand)
export class SavePostCommandHandler implements ICommandHandler<SavePostCommand> {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository
  ) { }
  async execute(command: SavePostCommand): Promise<void> {
    const { savePostDto, tx, user } = command

    const isExisted = await this._postRepo.isExisted(savePostDto.postID)
    if (!isExisted) {
      throw new NotFoundException(ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND))
    }

    const isSaved = await this._postRepo.isSavedPost(savePostDto.postID, user)
    if (isSaved) {
      throw new ConflictException(ResponseDTO.fail("Post have been saved already", UserErrorCode.POST_SAVED_ALREADY))
    }

    await this._postRepo.setTransaction(tx).savePost(savePostDto.postID, user)
  }
}