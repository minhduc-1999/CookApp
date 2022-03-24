import { AbstractEntity } from '../../base/entities/base.entity';
import { InteractiveTargetType } from '../../enums/social.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'interactions' })
export class InteractionEntity extends AbstractEntity {
  @Column({
    name: "type",
    type: "enum",
    enum: InteractiveTargetType
  })
  type: InteractiveTargetType

  @Column({
    name: "n_comments",
    default: 0
  })
  nComments: number

  @Column({
    name: "n_reactions",
    default: 0
  })
  nReactions: number

  constructor(data: Partial<InteractionEntity>) {
    super(data)
    this.type = data?.type
    this.nReactions = data?.nReactions
    this.nComments = data?.nComments
    this.nReactions = data?.nReactions
  }
}
