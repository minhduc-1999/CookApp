import { Post, SavedPost } from 'domains/social/post.domain';
import { Node, Relationship } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';
import { UserEntity } from './user.entity';

export class PostEntity {

  static toDomain(postNode: Node, authorNode?: Node, images?: string[], numOfComment?: number, numOfReaction?: number): Post {
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


export class SavedPostEntity {
  static relationship = {
    from: {
      user: {
        SAVE: "SAVE"
      }
    },
  }
  static toDomain(postNode: Node, relationship: Relationship, authorNode?: Node, images?: string[], numOfComment?: number, numOfReaction?: number): SavedPost {
    const { properties: postProps } = postNode
    const { properties: relProps } = relationship
    const audit = AuditEntity.toDomain(postNode)
    const post = new SavedPost({
      ...audit,
      content: postProps.content,
      numOfComment: numOfComment,
      numOfReaction: numOfReaction,
      images: images,
      savedAt: relProps.createdAt
    })
    if (authorNode) {
      post.author = UserEntity.toDomain(authorNode)
    }
    return post
  }

  static fromDomain(post: Partial<SavedPost>): Record<string, any> {
    const { images, videos, author, numOfReaction, numOfComment, ...remain } = post
    return {
      ...remain
    }
  }

  static getRelationshipProps(post: SavedPost): Record<string, any> {
    return {
      createdAt: post.savedAt
    }
  }
}
