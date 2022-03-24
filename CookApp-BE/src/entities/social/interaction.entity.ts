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
    name: "comments"
  })
  numberOfComment: number

  @Column({
    name: "reactions"
  })
  numberOfReaction: number
}
