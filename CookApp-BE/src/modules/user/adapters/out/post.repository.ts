import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument } from "domains/schemas/post.schema";
import { PostDTO } from "dtos/post.dto";
import { Model } from "mongoose";

export interface IPostRepository {
  createPost(post: PostDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
  updatePost(post: Partial<PostDTO>): Promise<PostDTO>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>
  ) {}

  async updatePost(post: Partial<PostDTO>): Promise<PostDTO> {
    const updatedPost = await this._postModel.findOneAndUpdate(
      { _id: post.id },
      { $set: post },
      { new: true }
    );
    return new PostDTO(updatedPost);
  }
  async getPostById(postId: string): Promise<PostDTO> {
    const postDoc = await this._postModel.findById(postId).populate("author");
    if (!postDoc) return null;
    return new PostDTO(postDoc);
  }

  async createPost(post: PostDTO): Promise<PostDTO> {
    const creatingPost = new this._postModel(new Post(post));
    const postDoc = await creatingPost.save();
    if (!postDoc) return null;
    const createdPost = new PostDTO(postDoc);
    return createdPost;
  }
}
