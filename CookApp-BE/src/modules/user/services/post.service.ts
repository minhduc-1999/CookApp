import { Injectable } from "@nestjs/common";
import { CreatePostDTO, PostDTO } from "../dtos/post.dto";

export interface IPostService {
    createPost(postDto: CreatePostDTO) : Promise<PostDTO>
}

@Injectable()
export class PostService implements IPostService {
  async createPost(postDto: CreatePostDTO): Promise<PostDTO> {
    return null;
  }
}