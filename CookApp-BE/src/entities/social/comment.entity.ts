import { RecipeStep } from 'domains/core/recipeStep.domain';
import { Comment, CommentTarget } from 'domains/social/comment.domain';
import { PostBase } from 'domains/social/post.domain';
import { Node, Relationship } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';
import { UserEntity } from './user.entity';

export class CommentEntity {
  static toDomain(commentRelationship: Relationship, userNode: Node, numReply?: number): Comment {
    const { properties: commentProps } = commentRelationship
    const audit = AuditEntity.toDomain(commentRelationship)
    const comment = new Comment({
      ...audit,
      content: commentProps.content,
      user: UserEntity.toDomain(userNode),
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

  static getNodeType(target: CommentTarget): "Post" | "RecipeStep" {
    if (target instanceof PostBase) {
      return "Post"
    }
    else if (target instanceof RecipeStep) {
      return "RecipeStep"
    }
    else {
      throw new Error("No target found")
    }
  }
}
