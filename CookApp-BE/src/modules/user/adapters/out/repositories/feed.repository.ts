import { Inject, Injectable, Logger } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "entities/social/post.entity";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { parseInt } from "lodash";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { int, Integer } from "neo4j-driver";

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async pushNewPost(post: Post, followerIDs: string[]): Promise<void> {
    this.neo4jService.write(`
        MATCH (u:User) WHERE u.id IN $followerIDs
        MATCH (p:Post{id: $postID})
        CREATE (u)-[:SEE]->(p)
      `,
      this.tx,
      {
        followerIDs: followerIDs,
        postID: post.id
      })
  }

  async getPosts(user: User, query: PageOptionsDto): Promise<Post[]> {
    const res = await this.neo4jService.read(`
        MATCH (u:User{id: $userID})-[:SEE|OWN]->(p:Post)
        WITH p, u
        ORDER BY p.createdAt DESC
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
          [(post)-[:CONTAIN]->(m:Media) | m.key] AS images
      `,
      {
        userID: user.id,
        skip: int(query.offset * query.limit),
        limit: int(query.limit)
      })
    if (res.records.length === 0) return []
    return res.records.map(record => {
      const postNode = record.get("post")
      const totalComment = parseInt(record.get("totalComment"))
      const totalReaction = parseInt(record.get("totalReaction"))
      const author = record.get("author")
      const images: string[] = record.get("images")
      return PostEntity.toDomain(postNode, author, images, totalComment, totalReaction)
    })
  }

  async getTotalPosts(user: User): Promise<number> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $userID})-[r:OWN|SEE]->(:Post) RETURN count(r) AS totalPost
      `,
      {
        userID: user.id
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalPost"))
  }
}
