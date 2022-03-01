import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { Transaction } from "neo4j-driver";
import { SavePostRequest } from "./savePostReponse";

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
  ) {}
  async execute(command: SavePostCommand): Promise<void> {
    const { savePostDto, tx, user } = command
    const isExisted = await this._postRepo.isExisted(savePostDto.postID)
    if (isExisted) {
      await this._postRepo.setTransaction(tx).savePost(savePostDto.postID, user)
    }
  }
}
