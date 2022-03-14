import { Audit } from "domains/audit.domain";
import { Image } from "domains/social/media.domain";

export class RecipeStep extends Audit{
  content: string;

  photos: Image[];

  constructor(step: Partial<RecipeStep>) {
    super(step)
    this.content = step?.content
    this.photos = step?.photos
  }
}
