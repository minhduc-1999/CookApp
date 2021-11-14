import { PostDTO } from "dtos/post.dto";

export class EditPostResponse extends PostDTO {
  constructor(option: Partial<PostDTO>) {
    super(option);
  }
}
