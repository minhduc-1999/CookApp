import { Expose } from "class-transformer";

export class RecipeStepDTO {
  @Expose()
  content: string;
  @Expose()
  order: number;
  @Expose()
  images: string[];
}
