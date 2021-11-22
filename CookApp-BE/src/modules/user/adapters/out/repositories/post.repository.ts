import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToClass } from "class-transformer";
import { Post, PostDocument } from "domains/schemas/post.schema";
import { PostDTO } from "dtos/post.dto";
import { ClientSession, Model } from "mongoose";

export interface IPostRepository {
  createPost(post: PostDTO, session: ClientSession): Promise<PostDTO>;
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
    return plainToClass(PostDTO, updatedPost, {
      excludeExtraneousValues: true,
    });
  }
  async getPostById(postId: string): Promise<PostDTO> {
    const postDoc = await this._postModel.findById(postId);
    if (!postDoc) return null;
    return plainToClass(PostDTO, postDoc, { excludeExtraneousValues: true, groups: ['post'] });
  }

  async createPost(
    post: PostDTO,
    session: ClientSession = null
  ): Promise<PostDTO> {
    const creatingPost = new this._postModel(new Post(post));
    const postDoc = await creatingPost.save({ session: session });
    if (!postDoc) return null;
    return plainToClass(PostDTO, postDoc, { excludeExtraneousValues: true });
  }
}
