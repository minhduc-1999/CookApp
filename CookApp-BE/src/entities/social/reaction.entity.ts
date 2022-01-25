import { Reaction } from 'domains/social/reaction.domain';
import { User } from 'domains/social/user.domain';
import { Path } from 'neo4j-driver'

export class ReactionEntity {

  static toDomain(path: Path): Reaction {
    const [segment] = path.segments
    const reaction = new Reaction({
      type: segment.relationship.properties.type,
      reactor: new User({
        id: segment.start.properties.id
      }) 
    })
    return reaction

  }

  static fromDomain(reaction: Partial<Reaction>): Record<string, any> {
    const { ...remain } = reaction
    return {
      ...remain,
    }
  }
}
