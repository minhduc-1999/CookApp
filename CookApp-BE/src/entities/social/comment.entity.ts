import { Comment } from 'domains/social/comment.domain';
import { User } from 'domains/social/user.domain';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class CommentEntity {
  static toDomain(node: Node, numReply?: number): Comment {
    const { properties } = node
    const audit = AuditEntity.toDomain(node)
    const comment = new Comment({
      ...audit,
      content: properties.content,
      user : new User({
        id: properties.authorID
      }),
      numberOfReply: numReply ?? 0
    })
    return comment
  }

  static fromDomain(comment: Partial<Comment>): Record<string, any> {
    const { user, target, replies, parent, numberOfReply, ...remain } = comment
    return {
      ...remain,
      authorID: user.id
    }
  }
}
