
import { CommentDTO } from 'dtos/social/comment.dto';
import { UserDTO } from 'dtos/social/user.dto';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class CommentEntity {
  static toDomain(node: Node, numReply?: number): CommentDTO {
    const { properties } = node
    const audit = AuditEntity.toDomain(node)
    const comment = new CommentDTO({
      ...audit,
      content: properties.content,
      user : new UserDTO({
        id: properties.authorID
      }),
      numberOfReply: numReply ?? 0
    })
    return comment
  }

  static fromDomain(comment: Partial<CommentDTO>): Record<string, any> {
    const { user, post, replies, parent, numberOfReply, ...remain } = comment
    return {
      ...remain,
      authorID: user.id
    }
  }
}
