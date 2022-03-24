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
    name: "comments",
    default: 0
  })
  numberOfComment: number

  @Column({
    name: "reactions",
    default: 0
  })
  numberOfReaction: number

  constructor(data: Partial<InteractionEntity>) {
    super(data)
    this.type = data?.type
    this.numberOfReaction = data?.numberOfReaction
    this.numberOfComment = data?.numberOfComment
    this.numberOfReaction = data?.numberOfReaction
  }
}
