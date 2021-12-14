import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "../adapters/out/repositories/post.repository";
import { PostDTO } from "../../../dtos/social/post.dto";
import { IUserService } from "modules/auth/services/user.service";

export interface IPostService {
  getPostDetail(postId: string, option?: PostOption): Promise<PostDTO>;
}

type PostOption = {
  attachAuthor: boolean;
};

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    @Inject("IUserService") private _userService: IUserService
  ) {}

  async getPostDetail(postId: string, option?: PostOption): Promise<PostDTO> {
    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID)
      );

    if (option?.attachAuthor) {
      const author = await this._userService.getUserById(post.author.id);
      post.author = {
        id: author.id,
        avatar: author.avatar,
        displayName: author.displayName,
      };
    } else {
      delete post.author;
    }

    return post;
  }
}
