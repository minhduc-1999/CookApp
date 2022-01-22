import { ProfileDTO } from 'dtos/social/profile.dto';
import { UserDTO } from 'dtos/social/user.dto';
import { Node } from 'neo4j-driver'

export class UserEntity {
  constructor(private readonly node: Node) {
  }

  toDomain(): UserDTO {
    const profile = new ProfileDTO()
    const user = new UserDTO({
      profile
    })
    return user

  }
}
