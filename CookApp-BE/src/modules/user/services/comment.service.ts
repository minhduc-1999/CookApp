import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { Comment } from "../../../domains/social/comment.domain";
import { ICommentRepository } from "../interfaces/repositories/comment.interface";

export interface ICommentService {
  getCommentBy(commentId: string): Promise<Comment>;
}

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @Inject("ICommentRepository") private _commentRepo: ICommentRepository
  ) {}

  async getCommentBy(commentId: string): Promise<Comment> {
    if (!commentId) return null
    const comment = await this._commentRepo.getCommentById(commentId);
    if (!comment)
      throw new NotFoundException(
        ResponseDTO.fail("Comment not found", UserErrorCode.COMMENT_NOT_FOUND)
      );
    return comment;
  }
}
