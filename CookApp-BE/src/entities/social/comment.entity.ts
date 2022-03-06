import { Comment } from 'domains/social/comment.domain';
import { User } from 'domains/social/user.domain';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class CommentEntity {
  static toDomain(commentNode: Node, userNode: Node, numReply?: number): Comment {
    const { properties: commentProps } = commentNode
    const {properties: userProps } = userNode
    const audit = AuditEntity.toDomain(commentNode)
    const comment = new Comment({
      ...audit,
      content: commentProps.content,
      user : new User(userProps),
      numberOfReply: numReply ?? 0
    })
    return comment
  }

  static fromDomain(comment: Partial<Comment>): Record<string, any> {
    const { user, target, replies, parent, numberOfReply, ...remain } = comment
    return {
      ...remain,
    }
  }
}
