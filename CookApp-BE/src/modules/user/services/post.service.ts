import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { Reaction } from "domains/social/reaction.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { Post } from "../../../domains/social/post.domain";
import { IPostRepository } from "../interfaces/repositories/post.interface";

export interface IPostService {
  getPostDetail(postId: string, userID?: string): Promise<[Post, Reaction]>;
}


@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
  ) { }

  async getPostDetail(postId: string, userID?: string): Promise<[Post, Reaction]> {

    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND)
      );

    let reaction: Reaction;

    // if (userID) {
    //    reaction = await this._postRepo.getReactionByUserId(
    //     userID,
    //     post.id
    //   );
    // }

    return [post, reaction];
  }
}
