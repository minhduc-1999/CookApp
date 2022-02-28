export class NotificationConfiguration {
  newFollower: boolean
  newPost: boolean
  postComment: boolean
  postReaction: boolean
  userID: string

  constructor(userID: string) {
    this.newFollower = false
    this.newPost = false
    this.postComment = false
    this.postReaction = false
    this.userID = userID
  }
}
