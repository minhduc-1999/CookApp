import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostEntity, SavedPostEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { PostBase, SavedPost, Post} from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { int, Node, Relationship } from "neo4j-driver";
import { MediaEntity } from "entities/social/media.entity";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }

  async getSavedPosts(user: User, queryOpt: PageOptionsDto): Promise<SavedPost[]> {
    const res = await this.neo4jService.read(`
        MATCH (u:User{id: $userID})-[r:SAVE]->(p:Post)
        WITH p, u, r 
        ORDER BY r.createdAt DESC
        SKIP $skip
        LIMIT $limit
        UNWIND p AS post
        CALL {
          WITH post
          MATCH (c:Comment)-[*]->(post) 
          RETURN count(c) AS totalComment
        }
        CALL {
          WITH post
          MATCH (post)<-[r:REACT]-(:User)
          RETURN count(r) AS totalReaction
        }
        RETURN post, 
          totalComment, 
          totalReaction, 
          u AS author,
          [(post)-[:CONTAIN]->(m:Media) | m] AS medias,
          r as relationship
      `,
      {
        userID: user.id,
        skip: int(queryOpt.offset * queryOpt.limit),
        limit: int(queryOpt.limit)
      })
    if (res.records.length === 0) return []
    return res.records.map(record => {
      const postNode: Node = record.get("post")
      const totalComment: number = parseInt(record.get("totalComment"))
      const totalReaction: number = parseInt(record.get("totalReaction"))
      const author: Node = record.get("author")
      const mediaNodes: Node[] = record.get("medias")
      const relationship: Relationship = record.get("relationship")
      return SavedPostEntity.toDomain(postNode,relationship, author, mediaNodes, totalComment, totalReaction)
    })
  }

  async getTotalSavedPost(user: User): Promise<number> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $userID})-[r:SAVE]->(:Post) RETURN count(r) AS totalPost
      `,
      {
        userID: user.id
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalPost"))
  }

  async deleteSavedPost(postID: string, user: User): Promise<void> {
    await this.neo4jService.write(`
          MATCH (:Post{id: $postID})<-[r:SAVE]-(:User{id: $userID})
          DETACH DELETE r
      `,
      this.tx,
      {
        postID,
        userID: user.id,
      })
  }
  async isSavedPost(postID: string, user: User): Promise<boolean> {
    const res = await this.neo4jService.read(`
          MATCH (:Post{id: $postID})<-[r:SAVE]-(:User{id: $userID})
          WITH count(r) as count
          CALL apoc.when (count > 0,
            "RETURN true AS bool",
            "RETURN false AS bool",
            {count:count}
          ) YIELD value
          return value.bool as result
       `,
      {
        postID,
        userID: user.id
      })
    if (res.records.length === 0)
      throw new InternalServerErrorException(ResponseDTO.fail("Something went wrong"))
    return res.records[0].get("result") as boolean
  }

  async savePost(item: SavedPost): Promise<void> {
    await this.neo4jService.write(`
            MATCH (p:Post),
              (u:User) 
            WHERE p.id = $postID AND 
              u.id = $userID
            CREATE (u)-[s:SAVE]->(p)
            SET s += $relProps
      `,
      this.tx,
      {
        postID: item.post.id,
        userID: item.saver.id,
        relProps: SavedPostEntity.fromDomain(item)
      })
  }

  async isExisted(postID: string): Promise<boolean> {
    const res = await this.neo4jService.read(`
          MATCH (:Post{id: $postID})
          WITH count(*) as count
          CALL apoc.when (count > 0,
            "RETURN true AS bool",
            "RETURN false AS bool",
            {count:count}
          ) YIELD value
          return value.bool as result
       `,
      {
        postID
      })
    if (res.records.length === 0)
      throw new InternalServerErrorException(ResponseDTO.fail("Something went wrong"))
    return res.records[0].get("result") as boolean
  }

  async createPost(post: Post): Promise<Post> {
    const res = await this.neo4jService.write(`
            MATCH (u:User) WHERE u.id = $authorID
            CREATE (p:Post)
            SET p += $properties, p.id = randomUUID()
            CREATE (u)-[:OWN]->(p)
            WITH p, u
            CALL {
                WITH p
                UNWIND $medias AS media
                CREATE (p)-[:CONTAIN]->(m:Media)
                SET m = media
            }
            RETURN 
              p AS post,
              u AS author,
              [(p)-[:CONTAIN]->(m:Media) | m] AS medias
      `,
      this.tx,
      {
        properties: PostEntity.fromDomain(post),
        authorID: post.author.id,
        medias: post.images.concat(post.videos).map(image => MediaEntity.fromDomain(image)),
      })
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("post")
    const authorNode = res.records[0].get("author")
    const mediaNodes: Node[] = res.records[0].get("medias")
    return PostEntity.toDomain(postNode, authorNode, mediaNodes)
  }
  async getPostById(postID: string): Promise<Post> {
    const res = await this.neo4jService.read(`
        MATCH (post:Post{id: $postID})<-[:OWN]-(u:User)
        CALL {
          WITH post
          MATCH (c:Comment)-[*]->(post) 
          RETURN count(c) AS totalComment
        }
        CALL {
          WITH post
          MATCH (post)<-[r:REACT]-(:User)
          RETURN count(r) AS totalReaction
        }
        RETURN 
          post, 
          u AS author, 
          [(post)-[:CONTAIN]->(m:Media) | m] AS medias, 
          totalComment,
          totalReaction
      `,
      {
        postID
      }
    )
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("post")
    const author = res.records[0].get("author")
    const mediaNodes: Node[] = res.records[0].get("medias")
    const totalComment = parseInt(res.records[0].get("totalComment"))
    const totalReaction = parseInt(res.records[0].get("totalReaction"))
    return PostEntity.toDomain(postNode, author, mediaNodes, totalComment, totalReaction)
  }
  async getPostByIds(postIDs: string[]): Promise<Post[]> {
    const res = await this.neo4jService.read(`
        MATCH (post:Post{id: $postID})<-[:OWN]-(u:User)
        CALL {
          WITH post
          MATCH (c:Comment)-[*]->(post) 
          RETURN count(c) AS totalComment
        }
        CALL {
          WITH post
          MATCH (post)<-[r:REACT]-(:User)
          RETURN count(r) AS totalReaction
        }
        RETURN 
          post, 
          u.id AS authorID, 
          [(post)-[:CONTAIN]->(m:Media) | m] as medias, 
          totalComment,
          totalReaction
      `,
      {
        postIDs
      }
    )
    if (res.records.length === 0)
      return null
    return res.records.map(record => {
      const postNode = record[0].get("post")
      const authorID = record[0].get("authorID")
      const mediaNodes: Node[] = record[0].get("medias")
      const totalComment = parseInt(record[0].get("totalComment"))
      const totalReaction = parseInt(record[0].get("totalReaction"))
      return PostEntity.toDomain(postNode, authorID, mediaNodes, totalComment, totalReaction)
    })
  }
  async updatePost(updatingPost: Post, editPostDto: EditPostRequest): Promise<void> {
    await this.neo4jService.write(`
            MATCH (p:Post{id: $postID})
            SET p += $newUpdate
            WITH p
            CALL {
                WITH p
                UNWIND $addedImages AS addImage
                CREATE (p)-[:CONTAIN]->(m:Media)
                SET m = addImage
            }
            CALL {
                WITH p
                UNWIND $deletedImages AS deleteImage
                MATCH (m:Media)
                WHERE m.key = deleteImage
                DETACH DELETE m
            }
      `,
      this.tx,
      {
        postID: updatingPost.id,
        newUpdate: {
          ...(PostEntity.fromDomain(updatingPost))
        },
        addedImages: updatingPost.images.map(image => MediaEntity.fromDomain(image)) ?? [],
        deletedImages: editPostDto.deleteImages ?? [],
      },
    )
  }

  async reactPost(reaction: Reaction): Promise<boolean> {
    if (reaction.target instanceof PostBase) {
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
  }

  async deleteReact(reaction: Reaction): Promise<boolean> {
    if (reaction.target instanceof PostBase) {
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
      return undefined
    return ReactionEntity.toDomain(res.records[0].get('path'))
  }
}
