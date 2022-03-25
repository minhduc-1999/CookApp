import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { Reaction } from "domains/social/reaction.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { Post, SavedPost } from "../../../domains/social/post.domain";
import { IPostRepository } from "../interfaces/repositories/post.interface";
import { IReactionRepository } from "../interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "../interfaces/repositories/savedPost.interface";

export interface IPostService {
  getPostDetail(postId: string, userId?: string): Promise<[Post, Reaction, SavedPost]>;
}


@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    @Inject("IReactionRepository") private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository") private _savedPostRepo: ISavedPostRepository
  ) { }

  async getPostDetail(postId: string, userId?: string): Promise<[Post, Reaction, SavedPost]> {

    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND)
      );

    let reaction: Reaction;
    let saved: SavedPost

    if (userId) {
      reaction = await this._reactionRepo.findById(
        userId,
        post.id
      );
      saved = await this._savedPostRepo.find(postId, userId)
    }

    return [post, reaction, saved];
  }
}
