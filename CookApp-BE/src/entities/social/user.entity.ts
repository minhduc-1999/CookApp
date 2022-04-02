import { Column, OneToOne, Entity, OneToMany } from 'typeorm';
import { AccountEntity } from './account.entity';
import { User } from '../../domains/social/user.domain';
import { Image } from '../../domains/social/media.domain';
import { Sex } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';
import { FollowEntity } from './follow.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {

  @Column({ name: 'height', nullable: true })
  height?: number

  @Column({ name: 'weight', nullable: true })
  weight?: number;

  @Column({
    name: 'birth_date',
    nullable: true
  })
  birthDate?: Date;

  @Column({ name: "first_name", nullable: true })
  firstName: string

  @Column({ name: "last_name", nullable: true })
  lastName: string

  @Column({
    type: "enum",
    enum: Sex,
    nullable: true
  })
  sex: Sex

  @Column({ name: "n_followers", default: 0 })
  nFollowers: number

  @Column({ name: "n_followees", default: 0 })
  nFollowees: number

  @Column({ name: "n_posts", default: 0 })
  nPosts: number

  @Column({ name: 'avatar', default: "images/avatar-default.jpg" })
  avatar: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column({ name: 'status', default: "" })
  status: string;

  @OneToOne(() => AccountEntity, account => account.user)
  account: AccountEntity

  @OneToMany(() => FollowEntity, follow => follow.followee)
  followees: FollowEntity[]

  @OneToMany(() => FollowEntity, follow => follow.follower)
  followers: FollowEntity[]

  constructor(user: User) {
    super(user)
    this.birthDate = user?.birthDate
    this.height = user?.height
    this.weight = user?.weight
    this.firstName = user?.firstName
    this.lastName = user?.lastName
    this.sex = user?.sex
    this.nPosts = user?.nPosts
    this.nFollowees = user?.nFollowees
    this.nFollowers = user?.nFollowers
    this.avatar = user?.avatar?.key
    this.displayName = user?.displayName
    this.account = user?.account && new AccountEntity(user.account)
    this.status = user?.status
  }

  toDomain(): User {
    if (!this.id) return null
    const data = this
    return new User({
      ...data,
      avatar: new Image({ key: data.avatar }),
      account: data.account?.toDomain()
    })
  }

  update() : Partial<UserEntity>{
    const {account, nPosts, nFollowees, nFollowers, ...remain } = this
    return {
      ...remain
    }
  }
}
