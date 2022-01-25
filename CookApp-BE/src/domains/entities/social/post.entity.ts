import { PostDTO } from 'dtos/social/post.dto';
import { UserDTO } from 'dtos/social/user.dto';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class PostEntity {

  static toDomain(node: Node, authorID: string, numOfComment?: number, numOfReaction?: number): PostDTO {
    const { properties } = node
    const audit = AuditEntity.toDomain(node)
    const post = new PostDTO({
      ...audit,
      content: properties.content,
      numOfComment: numOfComment,
      numOfReaction: numOfReaction,
      author: new UserDTO({
        id: authorID
      })
    })
    return post

  }

  static fromDomain(post: Partial<PostDTO>): Record<string, any> {
    const { images, videos, author, numOfReaction, numOfComment, ...remain } = post
    return {
      ...remain
    }
  }
}
