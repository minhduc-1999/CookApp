import { PostDTO } from 'dtos/social/post.dto';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class PostEntity {

  static toDomain(node: Node): PostDTO {
    const { properties } = node
    const audit = AuditEntity.toDomain(node)
    const user = new PostDTO({
      ...audit,
      content: properties.content
    })
    return user

  }

  static fromDomain(post: Partial<PostDTO>): Record<string, any> {
    const { images, videos, author, reactions, numOfReaction, numOfComment, ...remain } = post
    return {
      ...remain
    }
  }
}
