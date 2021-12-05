import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "domains/schemas/social/comment.schema";
import { ClientSession, Model } from "mongoose";
import { CommentDTO } from "dtos/social/comment.dto";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { CommentPageOption } from "modules/user/useCases/getPostComments";

export interface ICommentRepository {
  createComment(comment: CommentDTO): Promise<CommentDTO>;
  setSession(session: ClientSession): ICommentRepository;
  getCommentById(id: string): Promise<CommentDTO>;
  getPostComments(
    postId: string,
    query: CommentPageOption
  ): Promise<CommentDTO[]>;
}

@Injectable()
export class CommentRepository
  extends BaseRepository
  implements ICommentRepository {
  constructor(
    @InjectModel(Comment.name) private _commentModel: Model<CommentDocument>
  ) {
    super();
  }
  async getPostComments(
    postId: string,
    query: CommentPageOption
  ): Promise<CommentDTO[]> {
    const commentDocs = await this._commentModel
      .find({
        postId: postId,
        path: new RegExp(`,${query.parent},$`),
      })
      .sort({ createdAt: 1 })
      .skip(query.offset * query.limit)
      .limit(query.limit)
      .exec();
    return plainToClass(CommentDTO, commentDocs, {
      excludeExtraneousValues: true,
    });
  }

  async getCommentById(id: string): Promise<CommentDTO> {
    const commentDoc = await this._commentModel.findById(id).exec();
    if (!commentDoc) {
      return null;
    }
    return plainToClass(CommentDTO, commentDoc, {
      excludeExtraneousValues: true,
    });
  }
  async createComment(comment: CommentDTO): Promise<CommentDTO> {
    const creatingComment = new this._commentModel(new Comment(comment));
    const commentDoc = await creatingComment.save({ session: this.session });
    if (!commentDoc) return null;
    return plainToClass(CommentDTO, commentDoc, {
      excludeExtraneousValues: true,
    });
  }
}
