import { Post } from 'domains/social/post.domain';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';
import { UserEntity } from './user.entity';

export class PostEntity {

  static toDomain(postNode: Node, authorNode?: Node, numOfComment?: number, numOfReaction?: number, images?: string[]): Post {
    const { properties } = postNode
    const audit = AuditEntity.toDomain(postNode)
    const post = new Post({
      ...audit,
      content: properties.content,
      numOfComment: numOfComment,
      numOfReaction: numOfReaction,
      images: images
    })
    if (authorNode) {
      post.author = UserEntity.toDomain(authorNode)
    }
    return post

  }

  static fromDomain(post: Partial<Post>): Record<string, any> {
    const { images, videos, author, numOfReaction, numOfComment, ...remain } = post
    return {
      ...remain
    }
  }
}
