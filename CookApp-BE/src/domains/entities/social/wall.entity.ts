import { WallDTO } from 'dtos/social/wall.dto';
import { Node } from 'neo4j-driver'
import { UserEntity } from './user.entity';

export class WallEntity {
  static toDomain(userNode: Node, numOfFollwer: number, numOfFollowing: number, numOfPost: number): WallDTO {
    const wall = new WallDTO({
      numberOfFollowing: numOfFollowing,
      numberOfFollower: numOfFollwer,
      numberOfPost: numOfPost,
      user: UserEntity.toDomain(userNode)
    })
    return wall
  }
}
