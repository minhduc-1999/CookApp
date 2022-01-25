import { Inject, Injectable, Logger } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "domains/entities/social/post.entity";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { parseInt } from "lodash";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { int } from "neo4j-driver";
import { IFeedRepository } from "../repositories/feed.repository";

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async pushNewPost(post: PostDTO, followerIDs: string[]): Promise<void> {
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

  async getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]> {
    const res = await this.neo4jService.read(`
        MATCH (u:User{id: $userID})-[:SEE|OWN]->(p:Post)
        WITH p
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
        CALL {
          WITH post
          MATCH (post)<-[:OWN]-(u:User)
          RETURN u.id AS authorID
        }
        RETURN post, totalComment, totalReaction, authorID
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
      const authorID = record.get("authorID")
      return PostEntity.toDomain(postNode, authorID, totalComment, totalReaction)
    })
  }

  async getTotalPosts(user: UserDTO): Promise<number> {
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
