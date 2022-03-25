import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { DeleteSavedPostRequest } from "./deleteSavedPostRequest";

export class DeleteSavedPostCommand extends BaseCommand {
  deleteSavedPostDto: DeleteSavedPostRequest
  constructor(dto: DeleteSavedPostRequest, user: User, tx: ITransaction) {
    super(tx, user)
    this.deleteSavedPostDto = dto
  }
}

@CommandHandler(DeleteSavedPostCommand)
export class DeleteSavedPostCommandHandler implements ICommandHandler<DeleteSavedPostCommand> {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("ISavedPostRepository")
    private _savedPostRepo: ISavedPostRepository
  ) { }
  async execute(command: DeleteSavedPostCommand): Promise<void> {
    const { deleteSavedPostDto, tx, user } = command

    const post = await this._postRepo.getPostById(deleteSavedPostDto.postID)
    if (!post) {
      throw new NotFoundException(ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND))
    }

    const savedPost = await this._savedPostRepo.find(deleteSavedPostDto.postID, user.id)
    if (!savedPost) {
      throw new ConflictException(ResponseDTO.fail("Post have not been saved yet", UserErrorCode.POST_NOT_SAVED))
    }
    await this._savedPostRepo.setTransaction(tx).deleteSavedPost(savedPost)
  }
}
