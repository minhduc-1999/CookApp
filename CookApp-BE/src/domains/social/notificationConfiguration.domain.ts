export class NotificationConfiguration {
  newFollower: boolean
  newPost: boolean
  postComment: boolean
  postReaction: boolean

  constructor() {
    this.newFollower = false
    this.newPost = false
    this.postComment = false
    this.postReaction = false
  }
}
