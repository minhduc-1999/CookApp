import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Post, PostDocument } from "domains/schemas/post.schema";
import { PostDTO } from "dtos/post.dto";
import { ReactionDTO } from "dtos/reaction.dto";
import { ClientSession, Model } from "mongoose";

export interface IPostRepository {
  createPost(post: PostDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
  updatePost(post: Partial<PostDTO>): Promise<PostDTO>;
  reactPost(react: ReactionDTO, userId: string): Promise<boolean>;
  deleteReact(userId: string, postId: string): Promise<boolean>;
  getReactionByUserId(userId: string, postId: string): Promise<ReactionDTO>;
  setSession(session: ClientSession): IPostRepository;
}

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor(@InjectModel(Post.name) private _postModel: Model<PostDocument>) {
    super();
  }

  async updatePost(post: Partial<PostDTO>): Promise<PostDTO> {
    const updatedPost = await this._postModel.findOneAndUpdate(
      { _id: post.id },
      { $set: post },
      { new: true, session: this.session }
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
    const postDoc = await creatingPost.save({ session: this.session });
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
      {
        session: this.session,
      }
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
      {
        session: this.session,
      }
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
