import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { Transaction } from "neo4j-driver";
import { DeleteSavedPostRequest } from "./deleteSavedPostRequest";

export class DeleteSavedPostCommand extends BaseCommand {
  deleteSavedPostDto: DeleteSavedPostRequest
  constructor(dto: DeleteSavedPostRequest, user: User, tx: Transaction) {
    super(tx, user)
    this.deleteSavedPostDto = dto
  }
}

@CommandHandler(DeleteSavedPostCommand)
export class DeleteSavedPostCommandHandler implements ICommandHandler<DeleteSavedPostCommand> {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository
  ) { }
  async execute(command: DeleteSavedPostCommand): Promise<void> {
    const { deleteSavedPostDto, tx, user } = command

    const isExisted = await this._postRepo.isExisted(deleteSavedPostDto.postID)
    if (!isExisted) {
      throw new NotFoundException(ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND))
    }

    const isSaved = await this._postRepo.isSavedPost(deleteSavedPostDto.postID, user)
    if (!isSaved) {
      throw new ConflictException(ResponseDTO.fail("Post have not been saved yet", UserErrorCode.POST_NOT_SAVED))
    }
    await this._postRepo.setTransaction(tx).deleteSavedPost(deleteSavedPostDto.postID, user)
  }
}
