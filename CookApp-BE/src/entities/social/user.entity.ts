import { Column, OneToOne, Entity, OneToMany } from "typeorm";
import { AccountEntity } from "./account.entity";
import { User } from "../../domains/social/user.domain";
import { Image } from "../../domains/social/media.domain";
import { Sex } from "../../enums/social.enum";
import { AbstractEntity } from "../../base/entities/base.entity";
import { FollowEntity } from "./follow.entity";
import { ConversationMemberEntity } from "./conversation.entity";
import { FoodEntity } from "../../entities/core/food.entity";
import { FoodVoteEntity } from "../core/foodVote.entity";
import { UserTopicEntity } from "./topic.entity";

@Entity({ name: "users" })
export class UserEntity extends AbstractEntity {
  @Column({ name: "height", nullable: true })
  height?: number;

  @Column({ name: "weight", nullable: true })
  weight?: number;

  @Column({
    name: "birth_date",
    nullable: true,
  })
  birthDate?: Date;

  @Column({ name: "first_name", nullable: true })
  firstName: string;

  @Column({ name: "last_name", nullable: true })
  lastName: string;

  @Column({ name: "bio", nullable: true })
  bio: string;

  @Column({
    type: "enum",
    enum: Sex,
    nullable: true,
  })
  sex: Sex;

  @Column({ name: "n_followers", default: 0 })
  nFollowers: number;

  @Column({ name: "n_followees", default: 0 })
  nFollowees: number;

  @Column({ name: "n_posts", default: 0 })
  nPosts: number;

  @Column({ name: "avatar", default: "images/avatar-default.png" })
  avatar: string;

  @Column({ name: "display_name" })
  displayName: string;

  @OneToOne(() => AccountEntity, (account) => account.user)
  account: AccountEntity;

  @OneToMany(() => FollowEntity, (follow) => follow.followee)
  followees: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followers: FollowEntity[];

  @OneToMany(() => ConversationMemberEntity, (member) => member.user)
  memberOf: ConversationMemberEntity[];

  @OneToMany(() => FoodEntity, (food) => food.author)
  foods: FoodEntity[];

  @OneToMany(() => FoodVoteEntity, (vote) => vote.author)
  vote: FoodVoteEntity;

  @OneToMany(() => UserTopicEntity, (userTopic) => userTopic.topic)
  userTopics: UserTopicEntity[];

  constructor(user: User) {
    super(user);
    this.birthDate = user?.birthDate;
    this.height = user?.height;
    this.weight = user?.weight;
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
    this.sex = user?.sex;
    this.nPosts = user?.nPosts;
    this.nFollowees = user?.nFollowees;
    this.nFollowers = user?.nFollowers;
    this.avatar = user?.avatar?.key;
    this.displayName = user?.displayName;
    this.account = user?.account && new AccountEntity(user.account);
    this.bio = user?.bio;
  }

  toDomain(): User {
    if (!this.id) return null;
    const data = this;
    return new User({
      ...data,
      avatar: new Image({ key: data.avatar }),
      account: data.account?.toDomain(),
    });
  }

  update(): Partial<UserEntity> {
    const { account, nPosts, nFollowees, nFollowers, ...remain } = this;
    return {
      ...remain,
    };
  }
}
