import { Inject, Injectable, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async createPost(post: Post): Promise<Post> {
    const res = await this.neo4jService.write(`
            MATCH (u:User) WHERE u.id = $authorID
            CREATE (p:Post)
            SET p += $properties, p.id = randomUUID()
            CREATE (u)-[:OWN]->(p)
            RETURN p
      `,
      this.tx,
      {
        properties: {
          ...(PostEntity.fromDomain(post))
        },
        authorID: post.author.id
      })
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("p")
    return PostEntity.toDomain(postNode, post.author.id)
  }
  async getPostById(postID: string): Promise<Post> {
    const res = await this.neo4jService.read(
      `MATCH (p:Post{id: $postID})<-[:OWN]-(u:User) RETURN p, u.id AS authorID LIMIT 1`,
      {
        postID
      }
    )
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("p")
    const authorID = res.records[0].get("authorID")
    return PostEntity.toDomain(postNode, authorID)
  }
  async getPostByIds(postIDs: string[]): Promise<Post[]> {
    const res = await this.neo4jService.read(
      `MATCH (p:Post)<-[:OWN]-(u:User) WHERE p.id IN $postIDs RETURN p, u.id AS authorID`,
      {
        postIDs
      }
    )
    if (res.records.length === 0)
      return null
    return res.records.map(record => {
      const postNode = record.get("p")
      const authorID = record.get("authorID")
      return PostEntity.toDomain(postNode, authorID)
    })
  }
  async updatePost(post: Partial<Post>): Promise<Post> {
    const res = await this.neo4jService.write(`
            MATCH (p:Post{id: $postID})
            SET p += $newUpdate
            RETURN p
      `,
      this.tx,
      {
        postID: post.id,
        newUpdate: {
          ...(PostEntity.fromDomain(post))
        }
      },
    )
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("p")
    return PostEntity.toDomain(postNode, post.author.id)
  }

  async reactPost(reaction: Reaction): Promise<boolean> {
    const res = await this.neo4jService.write(`
        MATCH (u:User{id: $userID})
        MATCH (p:Post{id: $postID})
        CREATE (u)-[r:REACT]->(p) SET r += $properties 
        RETURN r
      `,
      this.tx,
      {
        postID: reaction.target.id,
        userID: reaction.reactor.id,
        properties: {
          type: reaction.type
        }
      },
    )
    if (res.records.length === 0)
      return false
    return true
  }

  async deleteReact(reaction: Reaction): Promise<boolean> {
    const res = await this.neo4jService.write(`
        MATCH (u:User{id: $userID})-[r:REACT]->(p:Post{id: $postID})
        DELETE r
      `,
      this.tx,
      {
        postID: reaction.target.id,
        userID: reaction.reactor.id
      },
    )
    if (res.records.length === 0)
      return false
    return true
  }
  async getReactionByUserId(userID: string, postID: string): Promise<Reaction> {
    const res = await this.neo4jService.read(`
        MATCH path = (u:User{id: $userID})-[r:REACT]->(p:Post{id: $postID})
        RETURN path
      `,
      {
        postID,
        userID,
      },
    )
    if (res.records.length === 0)
      return null
    return ReactionEntity.toDomain(res.records[0].get('path'))
  }
}
