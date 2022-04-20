import { AbstractEntity } from '../../base/entities/base.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Follow } from '../../domains/social/follow.domain';

@Entity({ name: 'follows' })
export class FollowEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity, user => user.followers, { nullable: false })
  @JoinColumn({ name: "follower_id" })
  follower: UserEntity

  @ManyToOne(() => UserEntity, user => user.followees, { nullable: false })
  @JoinColumn({ name: "followee_id" })
  followee: UserEntity

  constructor(follow: Follow) {
    super(null)
    this.followee = new UserEntity(follow?.followee)
    this.follower = new UserEntity(follow?.follower)
  }

  toDomain(): Follow {
    const data = this
    return new Follow({
      ...data,
      follower: this.follower.toDomain(),
      followee: this.followee.toDomain(),
    })
  }
}

