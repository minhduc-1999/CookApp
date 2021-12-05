import { OmitType } from "@nestjs/swagger";
import { PostDTO } from "dtos/social/post.dto";

export class CreatePostRequest extends OmitType(PostDTO, ["id"]) {}
