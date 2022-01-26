import { Wall } from 'domains/social/wall.domain';
import { Node } from 'neo4j-driver'
import { UserEntity } from './user.entity';

export class WallEntity {
  static toDomain(userNode: Node, numOfFollwer: number, numOfFollowing: number, numOfPost: number): Wall {
    const wall = new Wall({
      numberOfFollowing: numOfFollowing,
      numberOfFollower: numOfFollwer,
      numberOfPost: numOfPost,
      user: UserEntity.toDomain(userNode)
    })
    return wall
  }
}
