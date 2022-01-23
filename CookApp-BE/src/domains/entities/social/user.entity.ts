import { ProfileDTO } from 'dtos/social/profile.dto';
import { UserDTO } from 'dtos/social/user.dto';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class UserEntity {

  static toDomain(node: Node): UserDTO {
    const { properties } = node
    const profile = new ProfileDTO({
      height: properties["height"],
      weight: properties["weight"],
      firstName: properties["firstName"],
      lastName: properties["lastName"],
      birthDate: properties["birthDate"],
      sex: properties["sex"]
    })
    const audit = AuditEntity.toDomain(node)
    const user = new UserDTO({
      profile,
      ...audit,
      username: properties.username,
      displayName: properties.displayName,
      email: properties.email,
      password: properties.password,
      phone: properties.phone,
      avatar: properties.avatar,
      emailVerified: properties.emailVerified,
    })
    return user

  }

  static fromDomain(user: Partial<UserDTO>): Record<string, any> {
    const { profile, externalProvider, ...remain } = user
    return {
      ...remain,
      ...profile
    }
  }
}
