import { Inject, Injectable } from "@nestjs/common";
import { Comment, CommentTarget } from "domains/social/comment.domain";
import { BaseRepository } from "base/repository.base";
import { int } from "neo4j-driver";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { CommentEntity } from "entities/social/comment.entity";
import { PageOptionsDto } from "base/pageOptions.base";
import { parseInt } from "lodash";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { CommentTargetType } from "enums/comment.enum";


@Injectable()
export class CommentRepository
  extends BaseRepository
  implements ICommentRepository {
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }

  async createReply(comment: Comment): Promise<Comment> {
    const res = await this.neo4jService.write(`
        MATCH (u:User)-[c:COMMENT]->(target)
        WHERE c.id = $parentID
        CREATE (u)-[r:COMMENT]->(target)
        SET r += $properties, r.id = randomUUID(), r.replyFor = $parentID
        RETURN r AS reply, u AS user
        `,
      this.tx,
      {
        properties: {
          ...(CommentEntity.fromDomain(comment))
        },
        parentID: comment.parent.id,
      })
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("reply"), res.records[0].get("user"))
  }

  async createComment(comment: Comment): Promise<Comment> {
    const nodeType = CommentEntity.getNodeType(comment.target)
    const res = await this.neo4jService.write(`
        MERGE (target:${nodeType}{id: $targetID})
        MERGE (u:User{id: $userID})
        CREATE (u)-[c:COMMENT]->(target)
        SET c += $properties, c.id = randomUUID()
        RETURN c AS comment, u AS user
        `,
      this.tx,
      {
        properties: {
          ...(CommentEntity.fromDomain(comment))
        },
        targetID: comment.target.id,
        userID: comment.user.id
      })
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("comment"), res.records[0].get("user"))
  }

  async getCommentById(commentID: string): Promise<Comment> {
    const res = await this.neo4jService.read(`
        MATCH (u:User)-[c:COMMENT{id: $commentID}]->(n) 
        RETURN c AS comment, u AS user
        LIMIT 1
      `,
      {
        commentID
      }
    )
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("comment"), res.records[0].get("user"))
  }

  async getComments(target: CommentTarget, query: PageOptionsDto): Promise<Comment[]> {
    const nodeType = CommentEntity.getNodeType(target)
    const res = await this.neo4jService.read(`
       MATCH (target:${nodeType}{id: $targetID})<-[c:COMMENT]-(u:User)
       WHERE c.replyFor IS NULL
       WITH c AS comments, target, u AS user
       ORDER BY comments.createdAt DESC
       SKIP $skip
       LIMIT $limit
       UNWIND comments AS comment
       CALL {
         WITH comment, target
         MATCH (target)<-[r:COMMENT]-(:User)
         WHERE r.replyFor = comment.id
         RETURN count(r) AS numOfReply
       }
       RETURN comment, numOfReply, user
       `,
      {
        targetID: target.id,
        skip: int(query.offset * query.limit),
        limit: int(query.limit)
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => {
      const commentNode = record.get("comment")
      const numReply = parseInt(record.get("numOfReply"))
      const userNode = record.get('user')
      return CommentEntity.toDomain(commentNode, userNode, numReply)
    })
  }

  async getReplies(target: CommentTarget, replyOf: string, query: PageOptionsDto): Promise<Comment[]> {
    const nodeType = CommentEntity.getNodeType(target)
    const res = await this.neo4jService.read(`
       MATCH (target:${nodeType})<-[c:COMMENT]-(u:User)
       WHERE c.replyFor = $parentID 
       WITH c AS comments, target, u AS user
       ORDER BY comments.createdAt DESC
       SKIP $skip
       LIMIT $limit
       UNWIND comments AS comment
       CALL {
         WITH comment, target
         MATCH (target)<-[r:COMMENT]-(u)
         WHERE r.replyFor = comment.id
         RETURN count(r) AS numOfReply
       }
       RETURN comment, numOfReply, user
       `,
      {
        skip: int(query.offset * query.limit),
        limit: int(query.limit),
        parentID: replyOf
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => {
      const comment = record.get("comment")
      const numReply = parseInt(record.get("numOfReply"))
      const userNode = record.get("user")
      return CommentEntity.toDomain(comment, userNode, numReply)
    })
  }

  async getAmountOfReply(parentID: string): Promise<number> {
    const res = await this.neo4jService.read(`
          MATCH ()<-[r:COMMENT]-(:User)
          WHERE r.replyFor = $parentID
          RETURN count(r) AS totalReply
        `,
      {
        parentID
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalReply"))
  }

  async getTotalComments(target: CommentTarget): Promise<number> {
    const nodeType = CommentEntity.getNodeType(target)
    const res = await this.neo4jService.read(`
       MATCH (:User)-[c:COMMENT]->(:${nodeType}{id: $id}) RETURN count(c) AS totalComment
       `,
      {
        id: target.id
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalComment"))
  }

  async getAmountOfComment(target: CommentTarget): Promise<number> {
    const nodeType = CommentEntity.getNodeType(target)
    const res = await this.neo4jService.read(`
       MATCH (:User)-[r:COMMENT]->(:${nodeType}{id: $id})
       WHERE r.replyFor IS NULL
       RETURN count(r) AS amountOfComment
       `,
      {
        id: target.id
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("amountOfComment"))
  }
}
