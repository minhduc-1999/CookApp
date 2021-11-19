import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/user.dto";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { ICommentRepository } from "modules/user/adapters/out/repositories/comment.repository";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { CommentDTO } from "dtos/comment.dto";
import { ICommentService } from "modules/user/services/comment.service";

export class CreateCommentCommand extends BaseCommand {
  commentDto: CreateCommentRequest;
  constructor(
    user: UserDTO,
    comment: CreateCommentRequest,
    session?: ClientSession
  ) {
    super(session, user);
    this.commentDto = comment;
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository,
    @Inject("ICommentService")
    private _commentService: ICommentService
  ) {}
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentDto, user, session } = command;
    const parentComment = commentDto.parentId
      ? await this._commentService.getComment(commentDto.parentId)
      : null;
    const comment = CommentDTO.create({
      ...commentDto,
      user,
    }).setParent(parentComment);
    const createdComment = await this._commentRepo
      .setSession(session)
      .createComment(comment);
    return createdComment;
  }
}
