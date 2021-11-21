import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { ICommentRepository } from "../adapters/out/repositories/comment.repository";
import { CommentDTO } from "../../../dtos/comment.dto";

export interface ICommentService {
  getComment(commentId: string): Promise<CommentDTO>;
}

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @Inject("ICommentRepository") private _commentRepo: ICommentRepository
  ) {}

  async getComment(commentId: string): Promise<CommentDTO> {
    const comment = await this._commentRepo.getCommentById(commentId);
    if (!comment)
      throw new NotFoundException(
        ResponseDTO.fail("Comment not found", ErrorCode.INVALID_ID)
      );
    return comment;
  }
}
