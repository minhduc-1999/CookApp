import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { ConfigService } from "nestjs-config";
import path = require("path");
import { IPostRepository } from "../adapters/out/post.repository";
import { PostDTO } from "../dtos/post.dto";

export interface IPostService {
  getPostDetail(postId: string): Promise<PostDTO>;
}

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject("IPostRepository") private _postRepo: IPostRepository,
    private _configService: ConfigService
  ) {}

  async getPostDetail(postId: string): Promise<PostDTO> {
    const post = await this._postRepo.getPostById(postId);
    if (!post)
      throw new NotFoundException(
        ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID)
      );

    post.images = post.images.map(
      (imageUrl) => this._configService.get("storage.publicUrl") + imageUrl
    );

    return post;
  }
}
