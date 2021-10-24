import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IPostRepository } from "../adapters/out/post.repository";
import { CreatePostDTO, PostDTO, UpdatePostDTO } from "../dtos/post.dto";

export interface IPostService {
    createPost(postDto: CreatePostDTO, author: UserDTO) : Promise<PostDTO>
    getPostDetail(postId: string): Promise<PostDTO>
    editPost(updatingPost: UpdatePostDTO, editor: UserDTO): Promise<boolean>
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
  async createPost(postDto: CreatePostDTO, author: UserDTO): Promise<PostDTO> {
    return this._postRepo.createPost(postDto, author);
  }
  async editPost(
    updatingPost: UpdatePostDTO,
    editor: UserDTO
  ): Promise<boolean> {
    const existedPost = await this._postRepo.getPostById(updatingPost.id);
    if (!existedPost)
      throw new NotFoundException(ResponseDTO.fail('Post Not Found'))
    if (existedPost.author.id !== editor.id)
      throw new ForbiddenException(ResponseDTO.fail('You have no permission to edit post', ErrorCode.INVALID_OWNER))
    return this._postRepo.updatePost(updatingPost);
  }
}