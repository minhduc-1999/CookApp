import { CommentDTO } from "dtos/comment.dto";

export class CreateCommentResponse extends CommentDTO {
    constructor(option: Partial<CommentDTO>) {
        super(option)
    }
}
