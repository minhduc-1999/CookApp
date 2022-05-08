import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { Reaction } from "domains/social/reaction.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { PostType } from "enums/social.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import {
  FoodShare,
  Moment,
  Post,
  SavedPost,
} from "../../../domains/social/post.domain";
import { IPostRepository } from "../interfaces/repositories/post.interface";
import { IPostMediaRepository } from "../interfaces/repositories/postMedia.interface";
import { IReactionRepository } from "../interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "../interfaces/repositories/savedPost.interface";

export interface IPostService {
  getPostDetail(
    postId: string,
    userId?: string
  ): Promise<[Post, Reaction, SavedPost]>;
  createPost(post: Post, tx: ITransaction): Promise<Post>;
  updatePost(
    post: Post,
    data: Partial<Post>,
    tx: ITransaction,
    deleteMediaIds?: string[]
  ): Promise<void>;
  fulfillUrls(posts: Post[]): Promise<Post[]>;
}

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    @Inject("IReactionRepository") private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository")
    private _savedPostRepo: ISavedPostRepository,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}

  async fulfillUrls(posts: Post[]): Promise<Post[]> {
    if (!posts || posts.length === 0) return [];
    const fulfillOneMedia = async (post: Moment | FoodShare) => {
      post.medias = await this._storageService.getDownloadUrls(post.medias);
      return post;
    };
    for (let post of posts) {
      if (post.author) {
        [post.author.avatar] = await this._storageService.getDownloadUrls([
          post.author.avatar,
        ]);
      }
      switch (post.type) {
        case PostType.MOMENT:
          post = await fulfillOneMedia(post);
          break;
        case PostType.FOOD_SHARE:
          post = await fulfillOneMedia(post);
          (<FoodShare>post).ref.photos =
            await this._storageService.getDownloadUrls(
              (<FoodShare>post).ref.photos
            );
          break;
        case PostType.RECOMMEND:
          post = await fulfillOneMedia(post);
          break;
        default:
          continue;
      }
      if (post.type === PostType.MOMENT || post.type === PostType.FOOD_SHARE)
        (<Moment | FoodShare>post).medias =
          await this._storageService.getDownloadUrls(
            (<Moment | FoodShare>post).medias
          );
    }
    return posts;
  }
  async updatePost(
    post: Moment,
    data: Partial<Moment>,
    tx: ITransaction,
    deleteMediaIds?: string[]
  ): Promise<void> {
    if (data.medias?.length > 0) {
      await this._postMediaRepo.setTransaction(tx).addMedias(data.medias, post);
    }
    if (deleteMediaIds?.length > 0) {
      await this._postMediaRepo.setTransaction(tx).deleteMedias(deleteMediaIds);
    }
    await this._postRepo.setTransaction(tx).updatePost(post, data);
  }

  async createPost(post: Post, tx: ITransaction): Promise<Post> {
    const postResult = await this._postRepo.setTransaction(tx).createPost(post);
    switch (post.type) {
      case PostType.MOMENT:
      case PostType.FOOD_SHARE:
        const temp = post as Moment | FoodShare;
        if (temp.medias.length > 0) {
          let medias = await this._postMediaRepo
            .setTransaction(tx)
            .addMedias(temp.medias, postResult);
          if (medias.length > 0) {
            medias = await this._storageService.getDownloadUrls(medias);
            (<FoodShare | Moment>postResult).medias = medias;
          }
        }
        break;
      case PostType.RECOMMEND:
        break;
      default:
        throw new Error("Undefined post type");
    }
    return postResult;
  }

  async getPostDetail(
    postId: string,
    userId?: string
  ): Promise<[Post, Reaction, SavedPost]> {
    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND)
      );

    let reaction: Reaction;
    let saved: SavedPost;

    if (userId) {
      reaction = await this._reactionRepo.findById(userId, post.id);
      saved = await this._savedPostRepo.find(postId, userId);
    }

    return [post, reaction, saved];
  }
}
