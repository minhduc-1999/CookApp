import { Injectable } from "@nestjs/common";
import { Comment } from "domains/social/comment.domain";
import { BaseRepository } from "base/repository.base";
import { CommentEntity } from "entities/social/comment.entity";
import { PageOptionsDto } from "base/pageOptions.base";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";


@Injectable()
export class CommentRepository
  extends BaseRepository
  implements ICommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private _commentRepo: Repository<CommentEntity>
  ) {
    super()
  }
  async getReplies(parent: Comment, queryOpt: PageOptionsDto): Promise<[Comment[], number]> {
    const [entities, total] = await this._commentRepo
      .createQueryBuilder("comment")
      .where("parent_id = :parentId", { parentId: parent.id })
      .select(["comment"])
      .skip(queryOpt.limit * queryOpt.offset)
      .limit(queryOpt.limit)
      .getManyAndCount()
    return [entities.map(entity => entity.toDomain()), total]
  }

  async countReply(commentId: string): Promise<number> {
    const total = await this._commentRepo
      .createQueryBuilder("comment")
      .where("parent_id = :commentId", { commentId })
      .getCount()
    return total
  }

  async createComment(comment: Comment): Promise<Comment> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const entity = new CommentEntity(comment)
      if (comment?.parent) {
        entity.parent = new CommentEntity(comment.parent)
      }
      const commentEntity = await queryRunner.manager.save<CommentEntity>(entity)
      return commentEntity.toDomain()
    }
    return null
  }

  async getCommentById(id: string): Promise<Comment> {
    const entity = await this._commentRepo
      .createQueryBuilder("comment")
      .where("comment.id = :id", { id })
      .select(["comment"])
      .getOne()
    return entity?.toDomain()
  }

  async getComments(target: IInteractable, query: PageOptionsDto): Promise<[Comment[], number]> {
    const [entities, total] = await this._commentRepo
      .createQueryBuilder("comment")
      .innerJoinAndSelect("comment.user", "user")
      .where("comment.target_id = :targetId", { targetId: target.id })
      .andWhere("comment.parent_id IS NULL")
      .select(["comment", "user"])
      .skip(query.limit * query.offset)
      .limit(query.limit)
      .getManyAndCount()

    return [entities?.map(entity => entity.toDomain()), total]
  }
}
