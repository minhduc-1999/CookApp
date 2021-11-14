import { PostDTO } from "dtos/post.dto";

export class GetPostResponse extends PostDTO {
  constructor(option: Partial<PostDTO>) {
    super(option);
  }
}
