import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostEntity, SavedPostEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { Post, SavedPost } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { MediaType } from "enums/mediaType.enum";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import _ = require("lodash");
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { int } from "neo4j-driver";

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
          [(post)-[:CONTAIN]->(m:Media) | m.key] AS images,
          r as relationship
      `,
      {
        userID: user.id,
        skip: int(queryOpt.offset * queryOpt.limit),
        limit: int(queryOpt.limit)
      })
    if (res.records.length === 0) return []
    return res.records.map(record => {
      const postNode = record.get("post")
      const totalComment = parseInt(record.get("totalComment"))
      const totalReaction = parseInt(record.get("totalReaction"))
      const author = record.get("author")
      const images: string[] = record.get("images")
      const relationship = record.get("relationship")
      return SavedPostEntity.toDomain(postNode,relationship, author, images, totalComment, totalReaction)
    })
  }

  async getTotalSavedPost(user: User): Promise<number> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $userID})-[r:${SavedPostEntity.relationship.from.user.SAVE}]->(:Post) RETURN count(r) AS totalPost
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
          MATCH (:Post{id: $postID})<-[r:${SavedPostEntity.relationship.from.user.SAVE}]-(:User{id: $userID})
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
          MATCH (:Post{id: $postID})<-[r:${SavedPostEntity.relationship.from.user.SAVE}]-(:User{id: $userID})
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

  async savePost(post: SavedPost, user: User): Promise<void> {
    await this.neo4jService.write(`
            MATCH (p:Post),
              (u:User) 
            WHERE p.id = $postID AND 
              u.id = $userID
            CREATE (u)-[s:${SavedPostEntity.relationship.from.user.SAVE}]->(p)
            SET s += $relProps
      `,
      this.tx,
      {
        postID: post.id,
        userID: user.id,
        relProps: SavedPostEntity.getRelationshipProps(post)
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
                UNWIND $images AS image
                CREATE (p)-[:CONTAIN]->(m:Media {type: $imageType, key: image})
              UNION
                WITH p
                UNWIND $videos AS video
                CREATE (p)-[:CONTAIN]->(n:Media {type: $videoType, key: video})
            }
            RETURN p AS post, u AS author
      `,
      this.tx,
      {
        properties: {
          ...(PostEntity.fromDomain(post))
        },
        authorID: post.author.id,
        images: post.images,
        videos: post.videos,
        imageType: MediaType.POST_IMAGE,
        videoType: MediaType.POST_VIDEO
      })
    if (res.records.length === 0)
      return null
    const postNode = res.records[0].get("post")
    const authorNode = res.records[0].get("author")
    return PostEntity.toDomain(postNode, authorNode, post.images)
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
          [(post)-[:CONTAIN]->(m:Media) | m.key] AS images, 
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
    const images: string[] = res.records[0].get("images")
    const totalComment = parseInt(res.records[0].get("totalComment"))
    const totalReaction = parseInt(res.records[0].get("totalReaction"))
    return PostEntity.toDomain(postNode, author, images, totalComment, totalReaction)
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
          [(post)-[:CONTAIN]->(m:Media) | m.key] as images, 
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
      const images: string[] = record[0].get("images")
      const totalComment = parseInt(record[0].get("totalComment"))
      const totalReaction = parseInt(record[0].get("totalReaction"))
      return PostEntity.toDomain(postNode, authorID, images, totalComment, totalReaction)
    })
  }
  async updatePost(updatingPost: Partial<Post>, editPostDto: EditPostRequest): Promise<void> {
    await this.neo4jService.write(`
            MATCH (p:Post{id: $postID})
            SET p += $newUpdate
            WITH p
            CALL {
                WITH p
                UNWIND $addedImages AS addImage
                CREATE (p)-[:CONTAIN]->(m:Media)
                SET m.key = addImage, m.type = $postImageType
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
        addedImages: editPostDto.addImages ?? [],
        deletedImages: editPostDto.deleteImages ?? [],
        postImageType: MediaType.POST_IMAGE
      },
    )
  }

  async reactPost(reaction: Reaction): Promise<boolean> {
    if (reaction.target instanceof Post) {
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
    if (reaction.target instanceof Post) {
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
      return null
    return ReactionEntity.toDomain(res.records[0].get('path'))
  }
}
