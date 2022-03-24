import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { ReactionType } from '../../enums/social.enum';

@Entity({ name: 'reactions' })
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
}

