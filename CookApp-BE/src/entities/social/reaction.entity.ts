import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { ReactionType } from '../../enums/social.enum';
import { Reaction } from '../../domains/social/reaction.domain';
import { Audit } from '../../domains/audit.domain';

@Entity({ name: 'social.reactions' })
export class ReactionEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity

  @ManyToOne(() => InteractionEntity)
  @JoinColumn({ name: 'target_id'})
  target: InteractionEntity;

  @Column({
    name: 'type',
    type: "enum",
    enum: ReactionType
  })
  type: ReactionType;

  constructor(reaction: Reaction) {
    super(reaction)
    this.user = new UserEntity(reaction?.reactor)
    this.target = new InteractionEntity(reaction?.target)
    this.type = reaction?.type
  }

  toDomain(): Reaction {
    const audit = new Audit(this)
    return new Reaction({
      ...audit,
      type: this.type,
      reactor: this.user?.toDomain(),
    })
  }
}

