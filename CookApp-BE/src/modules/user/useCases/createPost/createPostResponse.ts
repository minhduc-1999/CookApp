import { PostDTO } from "modules/user/dtos/post.dto";

export class CreatePostResponse extends PostDTO {
    constructor(option: Partial<PostDTO>) {
        super(option)
    }
}
