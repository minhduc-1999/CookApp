import { Audit } from "../../domains/audit.domain";
import { User } from "./user.domain";


export class Follow extends Audit {
  follower: User

  followee: User

  constructor(follow: Partial<Follow>) {
    super(follow)
    this.follower = follow?.follower
    this.followee = follow?.followee
  }
}
