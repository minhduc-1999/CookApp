import { Inject, Injectable } from "@nestjs/common";
import { Comment, CommentTarget } from "domains/social/comment.domain";
import { BaseRepository } from "base/repository.base";
import { CommentEntity } from "entities/social/comment.entity";
import { PageOptionsDto } from "base/pageOptions.base";
import { parseInt } from "lodash";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";


@Injectable()
export class CommentRepository
  extends BaseRepository
  implements ICommentRepository {
  constructor() {
    super()
  }
    createComment(comment: Comment): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    getCommentById(id: string): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    getReplies(target: CommentTarget, replyOf: string, query: PageOptionsDto): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    getComments(target: CommentTarget, query: PageOptionsDto): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    getAmountOfReply(parentId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getAmountOfComment(target: CommentTarget): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getTotalComments(target: CommentTarget): Promise<number> {
        throw new Error("Method not implemented.");
    }
    createReply(comment: Comment): Promise<Comment> {
        throw new Error("Method not implemented.");
    }

}
