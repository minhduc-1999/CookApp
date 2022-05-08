import { Post } from "../post.domain";
import { User } from "../user.domain";

export class PostCreatedEvent {
  post: Post;
  author: User;
  constructor(post: Post, author: User) {
    this.post = post;
    this.author = author;
  }
}
