import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Comment,
  CommentDocument,
} from "domains/schemas/social/comment.schema";
import { Model } from "mongoose";
import { CommentDTO } from "dtos/social/comment.dto";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { CommentPageOption } from "modules/user/useCases/getPostComments";
import { Transaction } from "neo4j-driver";

export interface ICommentRepository {
  createComment(comment: CommentDTO): Promise<CommentDTO>;
  getCommentById(id: string): Promise<CommentDTO>;
  setTransaction(tx: Transaction): ICommentRepository
  getPostComments(
    postId: string,
    query: CommentPageOption
  ): Promise<CommentDTO[]>;
  getTotalReply(parentId: string): Promise<number>;
}

@Injectable()
export class CommentRepository
  extends BaseRepository
  implements ICommentRepository
{
  constructor(
    @InjectModel(Comment.name) private _commentModel: Model<CommentDocument>
  ) {
    super();
  }
  async getTotalReply(parentId: string): Promise<number> {
    const total = await this._commentModel.count({
      path: new RegExp(`,${parentId},$`),
    });
    return total;
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
    const commentDoc = await creatingComment.save();
    if (!commentDoc) return null;
    return plainToClass(CommentDTO, commentDoc, {
      excludeExtraneousValues: true,
    });
  }
}
