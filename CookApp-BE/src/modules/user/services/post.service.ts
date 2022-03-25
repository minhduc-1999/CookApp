import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { Reaction } from "domains/social/reaction.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Moment, Post, SavedPost } from "../../../domains/social/post.domain";
import { IPostRepository } from "../interfaces/repositories/post.interface";
import { IPostMediaRepository } from "../interfaces/repositories/postMedia.interface";
import { IReactionRepository } from "../interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "../interfaces/repositories/savedPost.interface";

export interface IPostService {
  getPostDetail(postId: string, userId?: string): Promise<[Post, Reaction, SavedPost]>;
  createPost(post: Post, tx: ITransaction): Promise<Post>
}


@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    @Inject("IReactionRepository") private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository") private _savedPostRepo: ISavedPostRepository,
    @Inject("IPostMediaRepository") private _postMediaRepo: IPostMediaRepository,
    @Inject("IStorageService") private _storageService: IStorageService,
  ) { }

  async createPost(post: Moment, tx: ITransaction): Promise<Moment> {
    const postResult = await this._postRepo.setTransaction(tx).createPost(post)
    if (post.medias.length > 0) {
      let medias = await this._postMediaRepo.setTransaction(tx).addMedias(post.medias, postResult)
      medias = await this._storageService.getDownloadUrls(medias)
      postResult.medias = medias
    }
    return postResult
  }

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
