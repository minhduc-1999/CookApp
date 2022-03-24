import { Column, OneToOne, Entity } from 'typeorm';
import { AccountEntity } from './account.entity';
import { User } from '../../domains/social/user.domain';
import { Image } from '../../domains/social/media.domain';
import { Sex } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';

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

  @Column({ name: "followers", default: 0 })
  followers: number

  @Column({ name: "followees", default: 0 })
  followees: number

  @Column({ name: "posts", default: 0 })
  posts: number

  @Column({ name: 'avatar', default: "images/avatar-default.jpg" })
  avatar: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @OneToOne(() => AccountEntity, account => account.user)
  account: AccountEntity

  constructor(user: User) {
    super(user)
    this.birthDate = user?.birthDate
    this.height = user?.height
    this.weight = user?.weight
    this.firstName = user?.firstName
    this.lastName = user?.lastName
    this.sex = user?.sex
    this.posts = user?.posts
    this.followees = user?.followees
    this.followers = user?.followers
    this.avatar = user?.avatar?.key
    this.displayName = user?.displayName
    this.account = user?.account && new AccountEntity(user.account)
  }

  toDomain(): User {
    const data = this
    return new User({
      ...data,
      avatar: new Image({ key: data.avatar }),
      account: data.account?.toDomain()
    })
  }

  getPartialUpdateObject() : Partial<UserEntity>{
    const {account, posts, followees, followers, ...remain } = this
    return {
      ...remain
    }
  }
}
