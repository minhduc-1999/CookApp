import { ReactionDTO } from 'dtos/social/reaction.dto';
import { UserDTO } from 'dtos/social/user.dto';
import { Path } from 'neo4j-driver'

export class ReactionEntity {

  static toDomain(path: Path): ReactionDTO {
    const [segment] = path.segments
    const reaction = new ReactionDTO({
      type: segment.relationship.properties.type,
      reactor: new UserDTO({
        id: segment.start.properties.id
      }) 
    })
    return reaction

  }

  static fromDomain(reaction: Partial<ReactionDTO>): Record<string, any> {
    const { ...remain } = reaction
    return {
      ...remain,
    }
  }
}
