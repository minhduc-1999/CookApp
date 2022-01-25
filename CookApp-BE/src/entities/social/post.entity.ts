import { Post } from 'domains/social/post.domain';
import { User } from 'domains/social/user.domain';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class PostEntity {

  static toDomain(node: Node, authorID: string, numOfComment?: number, numOfReaction?: number): Post {
    const { properties } = node
    const audit = AuditEntity.toDomain(node)
    const post = new Post({
      ...audit,
      content: properties.content,
      numOfComment: numOfComment,
      numOfReaction: numOfReaction,
      author: new User({
        id: authorID
      })
    })
    return post

  }

  static fromDomain(post: Partial<Post>): Record<string, any> {
    const { images, videos, author, numOfReaction, numOfComment, ...remain } = post
    return {
      ...remain
    }
  }
}
