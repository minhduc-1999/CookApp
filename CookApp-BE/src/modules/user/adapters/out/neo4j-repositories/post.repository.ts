import { Inject, Injectable, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "domains/entities/social/post.entity";
import { ReactionEntity } from "domains/entities/social/reaction.entity";
import { PostDTO } from "dtos/social/post.dto";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IPostRepository } from "../repositories/post.repository";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async createPost(post: PostDTO): Promise<PostDTO> {
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
    return PostEntity.toDomain(res.records[0].get("p"))
  }
  async getPostById(postID: string): Promise<PostDTO> {
    const res = await this.neo4jService.read(
      `MATCH (p:Post{id: $postID}) RETURN p LIMIT 1`,
      {
        postID
      }
    )
    if (res.records.length === 0)
      return null
    return PostEntity.toDomain(res.records[0].get("p"))
  }
  async getPostByIds(postIDs: string[]): Promise<PostDTO[]> {
    const res = await this.neo4jService.read(
      `MATCH (p:Post) WHERE p.id IN $postIDs RETURN p`,
      {
        postIDs
      }
    )
    if (res.records.length === 0)
      return null
    return res.records.map(record => {
      return PostEntity.toDomain(record.get("p"))
    })
  }
  async updatePost(post: Partial<PostDTO>): Promise<PostDTO> {
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
    return PostEntity.toDomain(res.records[0].get("u"))
  }
  async reactPost(react: ReactionDTO, postID: string): Promise<boolean> {
    const res = await this.neo4jService.write(`
        MATCH (u:User{id: $userID})
        MATCH (p:Post{id: $postID})
        CREATE (u)-[r:REACT]->(p) SET r += $properties 
        RETURN r
      `,
      this.tx,
      {
        postID,
        userID: react.userID,
        properties: {
          type: react.type
        }
      },
    )
    if (res.records.length === 0)
      return false
    return true
  }
  async deleteReact(userID: string, postID: string): Promise<boolean> {
    const res = await this.neo4jService.write(`
        MATCH (u:User{id: $userID})-[r:REACT]->(p:Post{id: $postID})
        DELETE r
      `,
      this.tx,
      {
        postID,
        userID,
      },
    )
    if (res.records.length === 0)
      return false
    return true
  }
  async getReactionByUserId(userID: string, postID: string): Promise<ReactionDTO> {
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
