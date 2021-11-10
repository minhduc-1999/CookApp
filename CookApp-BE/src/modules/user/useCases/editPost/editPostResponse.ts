import { PostDTO } from "modules/user/dtos/post.dto";

export class EditPostResponse extends PostDTO {
  constructor(option: Partial<PostDTO>) {
    super(option);
  }
}
