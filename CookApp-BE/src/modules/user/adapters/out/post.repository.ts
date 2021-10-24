import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDTO } from "modules/user/dtos/user.dto";
import { Post, PostDocument } from "modules/user/domains/schemas/post.schema";
import {
  CreatePostDTO,
  PostDTO,
  UpdatePostDTO,
} from "modules/user/dtos/post.dto";
import { Error, Model } from "mongoose";
import { createUpdatingObject } from "utils";

export interface IPostRepository {
  createPost(post: CreatePostDTO, author: UserDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
  updatePost(post: UpdatePostDTO): Promise<boolean>;
}

@Injectable()
export class PostRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>
  ) {}
  async updatePost(post: UpdatePostDTO): Promise<boolean> {
    try {
      const updatingPost = createUpdatingObject(post);
      const updateResult = await this._postModel.updateOne(
        { _id: post.id },
        { $set: updatingPost },
        { new: true }
      );
      console.log(updateResult);
      return true;
    } catch (err) {
      this.logger.error(err)
      return false
    }
  }
  async getPostById(postId: string): Promise<PostDTO> {
    try {
      const postDoc = await await this._postModel.findById(postId).populate('author');
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
