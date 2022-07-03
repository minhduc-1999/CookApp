import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument, PostItem } from "modules/user/entities/se/post.schema";
import { Post } from "domains/social/post.domain";

export interface IPostSeService {
  insertNewPostDoc(post: Post): Promise<void>;
}

@Injectable()
export class PostSeService implements IPostSeService {
  constructor(
    @InjectModel(PostItem.name) private _postModel: Model<PostDocument>
  ) {}

  async insertNewPostDoc(post: Post): Promise<void> {
    const item = new PostItem(post);
    await this._postModel.insertMany([item]);
  }
}
