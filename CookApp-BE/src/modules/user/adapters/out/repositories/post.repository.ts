import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Post, PostDocument } from "domains/schemas/social/post.schema";
import { PostDTO } from "dtos/social/post.dto";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { Model } from "mongoose";
import { Transaction } from "neo4j-driver";

export interface IPostRepository {
  createPost(post: PostDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
  getPostByIds(postId: string[]): Promise<PostDTO[]>;
  updatePost(post: Partial<PostDTO>): Promise<PostDTO>;
  reactPost(react: ReactionDTO, userId: string): Promise<boolean>;
  deleteReact(userId: string, postId: string): Promise<boolean>;
  getReactionByUserId(userId: string, postId: string): Promise<ReactionDTO>;
  setTransaction(tx: Transaction): IPostRepository
  updateNumComment(postId: string, delta: number): Promise<void>;
  deleteImages(postId: string, changedImages: string[]): Promise<PostDTO>;
  pushImages(postId: string, changedImages: string[]): Promise<PostDTO>;
}

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(@InjectModel(Post.name) private _postModel: Model<PostDocument>) {
    super();
  }
  async getPostByIds(postId: string[]): Promise<PostDTO[]> {
    const posts = await this._postModel.find({
      id: { $in: postId },
    });
    return plainToClass(PostDTO, posts, { excludeExtraneousValues: true });
  }
  async pushImages(postId: string, changedImages: string[]): Promise<PostDTO> {
    const updatedPost = await this._postModel.findOneAndUpdate(
      { _id: postId },
      { $push: { images: changedImages } },
      { new: true }
    );
    return plainToClass(PostDTO, updatedPost, {
      excludeExtraneousValues: true,
    });
  }
  async deleteImages(
    postId: string,
    changedImages: string[]
  ): Promise<PostDTO> {
    const updatedPost = await this._postModel.findOneAndUpdate(
      { _id: postId },
      { $pullAll: { images: changedImages } },
      { new: true }
    );
    return plainToClass(PostDTO, updatedPost, {
      excludeExtraneousValues: true,
    });
  }
  async updateNumComment(postId: string, delta: number): Promise<void> {
    await this._postModel.updateOne(
      {
        id: postId,
      },
      {
        $inc: { numOfComment: delta },
      },
    );
  }

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
    return plainToClass(PostDTO, postDoc, {
      excludeExtraneousValues: true,
      groups: ["post"],
    });
  }

  async createPost(post: PostDTO): Promise<PostDTO> {
    const creatingPost = new this._postModel(new Post(post));
    const postDoc = await creatingPost.save();
    if (!postDoc) return null;
    return plainToClass(PostDTO, postDoc, { excludeExtraneousValues: true });
  }

  async reactPost(react: ReactionDTO, postId: string): Promise<boolean> {
    const result = await this._postModel.updateOne(
      {
        _id: postId,
      },
      {
        $push: { reactions: react },
        $inc: { numOfReaction: 1 },
      },
    );
    return result.modifiedCount === 1;
  }

  async deleteReact(userId: string, postId: any): Promise<boolean> {
    const result = await this._postModel.updateOne(
      {
        _id: postId,
        "reactions.userId": userId,
      },
      {
        $pull: { reactions: { userId: userId } },
        $inc: { numOfReaction: -1 },
      },
    );
    return result.modifiedCount !== 0;
  }

  async getReactionByUserId(
    userId: string,
    postId: string
  ): Promise<ReactionDTO> {
    const result = await this._postModel
      .findOne(
        {
          _id: postId,
          "reactions.userId": userId,
        },
        { "reactions.$": 1 }
      )
      .exec();
    if (!result) return null;
    return plainToClass(ReactionDTO, result.reactions[0], {
      excludeExtraneousValues: true,
    });
  }
}
