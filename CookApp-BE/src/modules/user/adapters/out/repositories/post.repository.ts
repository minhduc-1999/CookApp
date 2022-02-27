import { Inject, Injectable, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { MediaType } from "enums/mediaType.enum";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";

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
