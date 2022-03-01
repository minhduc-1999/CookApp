import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { Post } from "../../../domains/social/post.domain";
import { IPostRepository } from "../interfaces/repositories/post.interface";

export interface IPostService {
  getPostDetail(postId: string, option?: PostOption): Promise<Post>;
}

type PostOption = {
  attachAuthor: boolean;
};

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
  ) {}

  async getPostDetail(postId: string, option?: PostOption): Promise<Post> {
    const defaultOpt: PostOption = {
      attachAuthor: true,
    };

    option = option ? { ...defaultOpt, ...option } : defaultOpt;

    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", UserErrorCode.POST_NOT_FOUND)
      );

    // if (option?.attachAuthor) {
    //   post.author = await this._userService.getUserPublicInfo(post.author.id);
    // } else {
    //   delete post.author;
    // }

    return post;
  }
}
