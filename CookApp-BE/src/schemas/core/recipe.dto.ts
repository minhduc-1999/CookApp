import { Expose } from "class-transformer";

export class RecipeStep {
  @Expose()
  content: string;
  @Expose()
  order: number;
  @Expose()
  images: string[];
}
