import { Inject, Injectable } from "@nestjs/common";
import auth from "config/auth";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IPostRepository } from "../adapters/out/post.repository";
import { CreatePostDTO, PostDTO } from "../dtos/post.dto";

export interface IPostService {
    createPost(postDto: CreatePostDTO, author: UserDTO) : Promise<PostDTO>
}

@Injectable()
export class PostService implements IPostService {
  constructor(@Inject('IPostRepository') private _postRepo: IPostRepository) {}
  async createPost(postDto: CreatePostDTO, author: UserDTO): Promise<PostDTO> {
    return this._postRepo.createPost(postDto, author);
  }
}