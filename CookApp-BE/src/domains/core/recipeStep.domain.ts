import { Audit } from "domains/audit.domain";

export class RecipeStep extends Audit{
  content: string;

  photos: string[];

  constructor(step: Partial<RecipeStep>) {
    super(step)
    this.content = step?.content
    this.photos = step?.photos
  }
}
