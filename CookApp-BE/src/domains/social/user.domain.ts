import { Audit } from "../../domains/audit.domain";
import { Sex } from "../../enums/social.enum";
import { Media } from "./media.domain";
import { Account } from "./account.domain";
import { generateDisplayName } from "../../utils";


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

  followers?: number

  followees?: number

  posts?: number

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
    this.posts = user?.posts
    this.followees = user?.followees
    this.followers = user?.followers
  }
}
