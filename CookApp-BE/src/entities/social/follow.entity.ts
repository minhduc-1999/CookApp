import { AbstractEntity } from '../../base/entities/base.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'follows' })
export class FollowEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "follower_id" })
  follower: UserEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "followee_id" })
  followee: UserEntity
}

