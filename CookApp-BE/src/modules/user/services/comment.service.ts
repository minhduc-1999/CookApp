import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Comment } from "../../../domains/social/comment.domain";
import { ICommentRepository } from "../interfaces/repositories/comment.interface";
import { ICommentMediaRepository } from "../interfaces/repositories/commentMedia.interface";

export interface ICommentService {
  getCommentBy(commentId: string): Promise<Comment>;
  createComment(comment: Comment, tx: ITransaction): Promise<Comment>
}

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @Inject("ICommentRepository") private _commentRepo: ICommentRepository,
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("ICommentMediaRepository") private _commentMediaRepo: ICommentMediaRepository,
  ) {}

  async createComment(comment: Comment, tx: ITransaction): Promise<Comment> {
    const result = await this._commentRepo.setTransaction(tx).createComment(comment)
    if (comment.medias?.length > 0) {
      let medias = await this._commentMediaRepo.setTransaction(tx).addMedias(comment.medias, result)
      if (medias.length > 0) {
        medias = await this._storageService.getDownloadUrls(medias)
        result.medias = medias
      }
    }
    return result
  }

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
