import { Audit } from "../../domains/audit.domain";
import { Sex } from "../../enums/social.enum";
import { Media } from "./media.domain";
import { Account } from "./account.domain";
import { generateDisplayName } from "../../utils";
import { Follow } from "./follow.domain";


export class User extends Audit {
  id: string 

  avatar?: Media;

  displayName?: string;

  height?: number;

  weight?: number;

  birthDate?: Date;

  firstName?: string;

  lastName?: string;

  sex?: Sex;

  nFollowers?: number

  nFollowees?: number

  nPosts?: number

  account?: Account

  constructor(user: Partial<User>) {
    super(user)
    this.id = user?.id
    this.account = user?.account
    this.displayName = user?.displayName ?? generateDisplayName()
    this.birthDate = user?.birthDate
    this.avatar = user?.avatar
    this.height = user?.height
    this.weight = user?.weight
    this.firstName = user?.firstName
    this.lastName = user?.lastName
    this.sex = user?.sex
    this.nPosts = user?.nPosts
    this.nFollowees = user?.nFollowees
    this.nFollowers = user?.nFollowers
  }

  follow(followee: User): Follow {
    return new Follow({
      follower: this,
      followee
    })
  }
}
