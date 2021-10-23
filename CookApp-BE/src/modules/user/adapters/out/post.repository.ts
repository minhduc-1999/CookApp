import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDTO } from "modules/user/dtos/user.dto";
import { Post, PostDocument } from "modules/user/domains/schemas/post.schema";
import { CreatePostDTO, PostDTO } from "modules/user/dtos/post.dto";
import { Model } from "mongoose";

export interface IPostRepository {
  createPost(post: CreatePostDTO, author: UserDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>
  ) {}
  async getPostById(postId: string): Promise<PostDTO> {
    try {
      const postDoc = await this._postModel.findById(postId).exec();
      if (!postDoc) return null;
      return new PostDTO(postDoc);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
  async createPost(post: CreatePostDTO, author: UserDTO): Promise<PostDTO> {
    const creatingPost = new this._postModel(new Post(post, author));
    try {
      const postDoc = await creatingPost.save();
      if (!postDoc) return null;
      const createdPost = new PostDTO(postDoc);
      return createdPost;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
