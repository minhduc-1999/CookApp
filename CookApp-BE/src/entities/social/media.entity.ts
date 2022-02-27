import { Media } from 'domains/social/media.domain';
import { Node } from 'neo4j-driver'

export class MediaEntity {

  static toDomain(node: Node): Media {
    const { properties } = node
    return new Media({
      key: properties.key,
      type: properties.type
    })

  }

  static fromDomain(media: Partial<Media>): Record<string, any> {
    return {
      key: media.key,
      type: media.type
    }
  }
}
