import { OmitType } from "@nestjs/swagger";
import { PostDTO } from "dtos/post.dto";

export class CreatePostRequest extends OmitType(PostDTO, ["id"]) {}
