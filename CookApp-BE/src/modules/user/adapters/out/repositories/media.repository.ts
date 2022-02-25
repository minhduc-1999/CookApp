import { Inject, Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { Media } from "domains/social/media.domain";
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
