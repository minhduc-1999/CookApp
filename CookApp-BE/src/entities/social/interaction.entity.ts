import { AbstractEntity } from '../../base/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'interactions' })
export class InteractionEntity extends AbstractEntity {

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
    this.nReactions = data?.nReactions
    this.nComments = data?.nComments
  }
}
