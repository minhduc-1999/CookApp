import { InternalServerErrorException } from '@nestjs/common';
import { Album, Moment, Post, SavedPost } from 'domains/social/post.domain';
import { Node, Relationship } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';
import { UserEntity } from './user.entity';

export class PostEntity {

  static toDomain(postNode: Node, authorNode?: Node, images?: string[], numOfComment?: number, numOfReaction?: number): Post {
    const { properties } = postNode
    const audit = AuditEntity.toDomain(postNode)
    let post: Post
    switch (properties.kind) {
      case "Moment":
        post = new Moment({
          ...audit,
          content: properties.content,
          numOfComment: numOfComment,
          numOfReaction: numOfReaction,
          images: images
        })
        break;
      case "Album":
        post = new Album({
          ...audit,
          name: properties.name,
          numOfComment: numOfComment,
          numOfReaction: numOfReaction,
          images: images
        })
        break;
      default:
        throw new InternalServerErrorException()
    }
    if (authorNode) {
      post.author = UserEntity.toDomain(authorNode)
    }
    return post

  }

  static fromDomain(post: Post): Record<string, any> {
    switch (post.kind) {
      case "Moment":
        return {
          content: post.content,
          createdAt: post.createdAt,
          kind: post.kind
        }
      case "Album":
        return {
          name: post.name,
          createdAt: post.createdAt,
          kind: post.kind
        }
    }
  }
}


export class SavedPostEntity {
  static toDomain(postNode: Node, relationship: Relationship, authorNode?: Node, images?: string[], numOfComment?: number, numOfReaction?: number): SavedPost {
    const { properties: relProps } = relationship
    const post = PostEntity.toDomain(postNode, authorNode, images, numOfComment, numOfReaction)
    const savedItem = new SavedPost({
      post,
      savedAt: relProps.createdAt
    })
    return savedItem
  }

  static fromDomain(item: Partial<SavedPost>): Record<string, any> {
    return {
      createdAt: item.savedAt
    }
  }
}
