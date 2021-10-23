import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDTO } from "modules/user/dtos/user.dto";
import { Post, PostDocument } from "modules/user/domains/schemas/post.schema";
import { CreatePostDTO, PostDTO } from "modules/user/dtos/post.dto";
import { Model } from "mongoose";

export interface IPostRepository {
  createPost(post: CreatePostDTO, author: UserDTO): Promise<PostDTO>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>
  ) {}
  async createPost(post: CreatePostDTO, author: UserDTO): Promise<PostDTO> {
    const creatingPost = new this._postModel(new Post(post, author));
    try {
      const postDoc = await creatingPost.save();
      if (!postDoc) return null;
      const createdPost = new PostDTO(postDoc);
      return createdPost;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
