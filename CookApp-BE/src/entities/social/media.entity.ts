import { Image, Media, Video } from 'domains/social/media.domain';
import { Node } from 'neo4j-driver'

export class MediaEntity {

  static toDomain(node: Node): Media {
    const { properties } = node
    switch (properties.type) {
      case "IMAGE":
        return new Image({
          key: properties.key
        })
      case "VIDEO":
        return new Video({
          key: properties.key
        })
    }

  }

  static fromDomain(media: Partial<Media>): Record<string, any> {
    return {
      key: media.key,
      type: media.type
    }
  }
}
