import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { PostDTO } from "../../../dtos/social/post.dto";
import { IUserService } from "modules/auth/services/user.service";
import { IPostRepository } from "../interfaces/repositories/post.interface";

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
    const defaultOpt: PostOption = {
      attachAuthor: true,
    };

    option = option ? { ...defaultOpt, ...option } : defaultOpt;

    const post = await this._postRepo.getPostById(postId);

    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID)
      );

    // if (option?.attachAuthor) {
    //   post.author = await this._userService.getUserPublicInfo(post.author.id);
    // } else {
    //   delete post.author;
    // }

    return post;
  }
}
