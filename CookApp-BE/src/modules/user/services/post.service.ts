import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IPostRepository } from "../adapters/out/repositories/post.repository";
import { PostDTO } from "../../../dtos/post.dto";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";

export interface IPostService {
  getPostDetail(postId: string): Promise<PostDTO>;
}

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}

  async getPostDetail(postId: string): Promise<PostDTO> {
    const post = await this._postRepo.getPostById(postId);
    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID)
      );

    post.images = await this._storageService.getDownloadUrls(post.images);

    return post;
  }
}
