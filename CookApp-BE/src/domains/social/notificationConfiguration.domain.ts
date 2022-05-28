export class NotificationConfiguration {
  newFollower: boolean;
  newPost: boolean;
  postComment: boolean;
  postReaction: boolean;
  newFood: boolean;
  foodConfirmation: boolean;
  userID: string;

  constructor(userID: string) {
    this.newFollower = true;
    this.newPost = true;
    this.postComment = true;
    this.postReaction = true;
    this.foodConfirmation = true;
    this.newFood = true;
    this.userID = userID;
  }
}
