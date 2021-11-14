import { PostDTO } from "dtos/post.dto";

export class CreatePostResponse extends PostDTO {
    constructor(option: Partial<PostDTO>) {
        super(option)
    }
}
