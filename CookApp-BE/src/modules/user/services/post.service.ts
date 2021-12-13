import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "../adapters/out/repositories/post.repository";
import { PostDTO } from "../../../dtos/social/post.dto";

export interface IPostService {
  getPostDetail(postId: string): Promise<PostDTO>;
}

@Injectable()
export class PostService implements IPostService {
  constructor(@Inject("IPostRepository") private _postRepo: IPostRepository) {}

  async getPostDetail(postId: string): Promise<PostDTO> {
    const post = await this._postRepo.getPostById(postId);
    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID)
      );

    return post;
  }
}
