import { PartialType, PickType } from "@nestjs/swagger";
import { PostDTO } from "dtos/post.dto";

export class EditPostRequest extends PartialType(
  PickType(PostDTO, ["content", "images", "videos", "updatedAt", "id"])
) {}
