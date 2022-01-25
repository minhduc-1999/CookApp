import { Inject, Injectable } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "domains/entities/social/post.entity";
import { WallEntity } from "domains/entities/social/wall.entity";
import { PostDTO } from "dtos/social/post.dto";
import { WallDTO } from "dtos/social/wall.dto";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { int } from "neo4j-driver";

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }

  async getPosts(userID: string, query: PageOptionsDto): Promise<PostDTO[]> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $userID})-[:OWN]->(p:Post) 
        RETURN p
        ORDER BY p.createdAd DESC
        SKIP $skip
        LIMIT $limit
      `,
      {
        userID,
        skip: int(query.offset * query.limit),
        limit: int(query.limit)
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => PostEntity.toDomain(record.get("p"), userID))
  }

  async getTotalPosts(userID: string): Promise<number> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $userID})-[r:OWN]->(:Post) RETURN count(r) AS totalPost
      `,
      {
        userID
      }
    )
    if (res.records.length === 0)
      return 0
    return parseInt(res.records[0].get("totalPost"))
  }

  async deleteFollower(userID: string, targetID: string): Promise<void> {
    await this.neo4jService.write(`
        MATCH (:User{id: $followerID})-[r:FOLLOW]->(:User{id: $targetID}) DELETE r
      `,
      this.tx,
      {
        targetID,
        followerID: userID
      }
    )
  }

  async createFollower(userID: string, targetID: string): Promise<void> {
    await this.neo4jService.write(`
        MATCH (target:User{id: $targetID})
        MATCH (follower:User{id: $followerID})
        CREATE (follower)-[:FOLLOW]->(target)
      `,
      this.tx,
      {
        targetID,
        followerID: userID
      }
    )
  }

  async isFollowed(sourceID: string, targetID: string): Promise<boolean> {
    const res = await this.neo4jService.read(`
        MATCH (:User{id: $followerID})-[r:FOLLOW]->(:User{id: $targetID}) return count(r) > 0 as isFollowed 
      `,
      {
        followerID: sourceID,
        targetID
      }
    )
    if (res.records.length === 0)
      return false
    return res.records[0].get("isFollowed")
  }

  async getFollowers(userID: string): Promise<string[]> {
    const res = await this.neo4jService.read(`
        MATCH (follower:User)-[r:FOLLOW]->(:User{id: $userID}) return follower.id as followerId
      `,
      {
        userID
      }
    )
    if (res.records.length === 0)
      return []
    return res.records.map(record => record.get("followerId") as string)
  }

  async getFollowing(userID: string): Promise<string[]> {
    const res = await this.neo4jService.read(`
        MATCH (target:User)<-[r:FOLLOW]-(:User{id: $userID}) return target.id as followingIds
      `,
      {
        userID
      }
    )
    if (res.records.length === 0)
      return []
    return res.records[0].get("followingIds")
  }

  async getWall(userID: string): Promise<WallDTO> {
    const res = await this.neo4jService.read(`
        MATCH (u:User{id: $userID})
        CALL {
                WITH u
                MATCH (u)-[r:FOLLOW]->(:User)
                RETURN count(r) AS numOfFollowing
        }
        CALL {
                WITH u
                MATCH (u)<-[r:FOLLOW]-(:User)
                RETURN count(r) AS numOfFollower
        }
        CALL {
                WITH u
                MATCH (u)-[r:OWN]->(:Post)
                RETURN count(r) AS numOfPost
        }
        RETURN u, numOfFollowing, numOfFollower, numOfPost
      `,
      {
        userID
      }
    )
    if (res.records.length === 0)
      return null
    const userNode = res.records[0].get("u")
    const numOfPost = res.records[0].get("numOfPost").toNumber()
    const numOfFollower = res.records[0].get("numOfFollower").toNumber()
    const numOfFollowing = res.records[0].get("numOfFollowing").toNumber()
    return WallEntity.toDomain(userNode, numOfFollower, numOfFollowing, numOfPost)
  }
}
