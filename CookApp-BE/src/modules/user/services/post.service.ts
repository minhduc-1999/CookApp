import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IPostRepository } from "../adapters/out/post.repository";
import { CreatePostDTO, PostDTO } from "../dtos/post.dto";

export interface IPostService {
    createPost(postDto: CreatePostDTO, author: UserDTO) : Promise<PostDTO>
    getPostDetail(postId: string): Promise<PostDTO>
}

@Injectable()
export class PostService implements IPostService {
  constructor(@Inject('IPostRepository') private _postRepo: IPostRepository) {}
  async getPostDetail(postId: string) : Promise<PostDTO> {
    const post = await this._postRepo.getPostById(postId)
    if (!post) throw new NotFoundException(ResponseDTO.fail("Post not found", ErrorCode.INVALID_ID))
    return post
  }
  async createPost(postDto: CreatePostDTO, author: UserDTO): Promise<PostDTO> {
    return this._postRepo.createPost(postDto, author);
  }


}