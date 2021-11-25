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
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";

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
    private _commentService: ICommentService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository
  ) {}
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentDto, user, session } = command;
    const parentComment = commentDto.parentId
      ? await this._commentService.getComment(commentDto.parentId)
      : commentDto.postId;
    const comment = CommentDTO.create({
      ...commentDto,
      user,
    }).setParent(parentComment);
    const createdComment = await this._commentRepo
      .setSession(session)
      .createComment(comment);
    return await Promise.all([
      this._feedRepo.updateNumComment(commentDto.postId, 1),
      this._postRepo.updateNumComment(commentDto.postId, 1),
    ]).then(() => createdComment);
  }
}
