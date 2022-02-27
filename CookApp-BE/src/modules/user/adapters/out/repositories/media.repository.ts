import { Inject, Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { Media } from "domains/social/media.domain";
import { Reaction } from "domains/social/reaction.domain";
import { MediaEntity } from "entities/social/media.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { MediaType } from "enums/mediaType.enum";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IMediaRepository } from "modules/user/interfaces/repositories/media.interface";

@Injectable()
export class MediaRepository extends BaseRepository implements IMediaRepository {
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async reactMedia(reaction: Reaction): Promise<void> {
    if (reaction.target instanceof Media) {
      await this.neo4jService.write(`
        MATCH (u:User{id: $userID})
        MATCH (p:Media{key: $key})
        CREATE (u)-[r:REACT]->(p) SET r += $properties 
        RETURN r
      `,
        this.tx,
        {
          key: reaction.target.key,
          userID: reaction.reactor.id,
          properties: {
            type: reaction.type
          }
        },
      )
    }
  }
  async deleteReaction(reaction: Reaction): Promise<void> {
    if (reaction.target instanceof Media) {
      await this.neo4jService.write(`
        MATCH (u:User{id: $userID})-[r:REACT]->(p:Media{key: $key})
        DELETE r
      `,
        this.tx,
        {
          key: reaction.target.key,
          userID: reaction.reactor.id
        },
      )
    }
  }
  async getMedia(mediaKey: string): Promise<Media> {
    const res = await this.neo4jService.read(`
        MATCH (media:Media{key: $mediaKey})
        RETURN media
      `,
      {
        mediaKey,
      },
    )
    if (res.records.length === 0)
      return null
    return MediaEntity.toDomain(res.records[0].get('media'))
  }
  async getReacitonByUserID(userID: string, mediaKey: string): Promise<Reaction> {
    const res = await this.neo4jService.read(`
        MATCH path = (u:User{id: $userID})-[r:REACT]->(p:Media{key: $mediaKey})
        RETURN path
      `,
      {
        mediaKey,
        userID,
      },
    )
    if (res.records.length === 0)
      return null
    return ReactionEntity.toDomain(res.records[0].get('path'))
  }

  async deleteMedias(keys: string[]): Promise<void> {
    if (!keys || keys.length === 0)
      return
    await this.neo4jService.write(`
        UNWIND $keys as key
        MATCH (n:Media)
        WHERE n.key = key
        DETACH DELETE n
      `,
      this.tx,
      {
        keys
      }
    )
  }
  async addMedia(media: Media): Promise<void> {
    await this.neo4jService.write(`
        CREATE (n:Media)
        SET n += $prop
        RETURN n as media
      `,
      this.tx,
      {
        prop: media
      }
    )
  }

  async addMedias(keys: string[], type: MediaType): Promise<void> {
    if (!keys || keys.length === 0)
      return
    await this.neo4jService.write(`
        UNWIND $keys AS key
        CREATE (n:Media)
        SET n.key = key, n.type = $type
      `,
      this.tx,
      {
        keys,
        type
      }
    )
  }

  async deleteMedia(key: string): Promise<void> {
    if (!key) return
    await this.neo4jService.write(`
        MATCH (n:Media)
        WHERE n.key = $key
        DETACH DELETE n
      `,
      this.tx,
      {
        key
      }
    )
  }

}
