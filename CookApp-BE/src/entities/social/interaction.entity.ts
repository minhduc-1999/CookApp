import { AbstractEntity } from '../../base/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { IInteractable } from 'domains/interfaces/IInteractable.interface';

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

  constructor(data: IInteractable) {
    super(data)
    this.nReactions = data?.nReactions
    this.nComments = data?.nComments
  }
}
