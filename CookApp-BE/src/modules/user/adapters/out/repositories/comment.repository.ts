import { Inject, Injectable } from "@nestjs/common";
import { Comment } from "domains/social/comment.domain";
import { BaseRepository } from "base/repository.base";
import { int } from "neo4j-driver";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { CommentEntity } from "entities/social/comment.entity";
import { PageOptionsDto } from "base/pageOptions.base";
import { parseInt } from "lodash";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";


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
            MATCH (c:Comment) WHERE c.id = $commentID
            CREATE (reply:Comment)
            SET reply += $properties, reply.id = randomUUID()
            CREATE (reply)-[:REPLY_FOR]->(c)
            RETURN reply
      `,
      this.tx,
      {
        properties: {
          ...(CommentEntity.fromDomain(comment))
        },
        commentID: comment.parent.id
      })
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("reply"))
  }

  async createComment(comment: Comment): Promise<Comment> {
    const res = await this.neo4jService.write(`
            MATCH (p:Post) WHERE p.id = $postID
            CREATE (c:Comment)
            SET c += $properties, c.id = randomUUID()
            CREATE (c)-[:COMMENT_FOR]->(p)
            RETURN c
      `,
      this.tx,
      {
        properties: {
          ...(CommentEntity.fromDomain(comment))
        },
        postID: comment.target.id,
      })
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("c"))
  }

  async getCommentById(commentID: string): Promise<Comment> {
    const res = await this.neo4jService.read(
      `MATCH (c:Comment{id: $commentID}) RETURN c LIMIT 1`,
      {
        commentID
      }
    )
    if (res.records.length === 0)
      return null
    return CommentEntity.toDomain(res.records[0].get("c"))
  }

  async getPostComments(postID: string, query: PageOptionsDto): Promise<Comment[]> {
    const res = await this.neo4jService.read(`
        MATCH (:Post{id: $postID})<-[:COMMENT_FOR]-(c:Comment)
        WITH c AS comments
        ORDER BY comments.createdAt DESC
        SKIP $skip
        LIMIT $limit
        UNWIND comments AS comment
        CALL {
              WITH comment
              MATCH (comment)-[r:REPLY_FOR]-(:Comment)
              RETURN count(r) AS numOfReply
        }
        RETURN comment, numOfReply
      `,
      {
        postID,
        skip: int(query.offset * query.limit),
        limit: int(query.limit)
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => {
      const commentNode = record.get("comment")
      const numReply = parseInt(record.get("numOfReply"))
      return CommentEntity.toDomain(commentNode, numReply)
    })
  }

  async getReplies(parentID: string, query: PageOptionsDto): Promise<Comment[]> {
    const res = await this.neo4jService.read(`
        MATCH (:Comment{id: $commentID})<-[:REPLY_FOR]-(c:Comment)
        WITH c AS comments
        ORDER BY comments.createdAt DESC
        SKIP $skip
        LIMIT $limit
        UNWIND comments AS comment
        CALL {
              WITH comment
              MATCH (comment)-[r:REPLY_FOR]-(:Comment)
              RETURN count(r) AS numOfReply
        }
        RETURN comment, numOfReply
      `,
      {
        commentID: parentID,
        skip: int(query.offset * query.limit),
        limit: int(query.limit)
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => {
      const comment = record.get("comment")
      const numReply = parseInt(record.get("numOfReply"))
      return CommentEntity.toDomain(comment, numReply)
    })
  }

  async getAmountOfReply(parentID: string): Promise<number> {
    const res = await this.neo4jService.read(
      `MATCH (:Comment{id: $commentID})<-[r:REPLY_FOR]-(:Comment) RETURN count(r) AS totalReply`,
      {
        commentID: parentID
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalReply"))
  }

  async getTotalPostComments(postID: string): Promise<number> {
    const res = await this.neo4jService.read(`
        MATCH (c:Comment)-[*]->(:Post{id: $postID}) return count(c) AS totalComment
      `,
      {
        postID
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalComment"))
  }

  async getAmountOfComment(postID: string): Promise<number> {
    const res = await this.neo4jService.read(`
          MATCH (:Post)-[r:COMMENT_FOR]-(:Comment) RETURN count(r) AS amountOfComment
        `,
      {
        postID
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("amountOfComment"))
  }
}
