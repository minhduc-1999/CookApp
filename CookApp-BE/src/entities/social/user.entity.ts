import { Profile } from 'domains/social/profile.domain';
import { User } from 'domains/social/user.domain';
import { Node } from 'neo4j-driver'
import { AuditEntity } from '../base.entity';

export class UserEntity {

  static toDomain(node: Node): User {
    const { properties } = node
    const profile = new Profile({
      height: properties["height"],
      weight: properties["weight"],
      firstName: properties["firstName"],
      lastName: properties["lastName"],
      birthDate: properties["birthDate"],
      sex: properties["sex"]
    })
    const audit = AuditEntity.toDomain(node)
    const user = new User({
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

  static fromDomain(user: Partial<User>): Record<string, any> {
    const { profile, externalProvider, ...remain } = user
    return {
      ...remain,
      ...profile
    }
  }
}
