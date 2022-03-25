import { Audit } from "domains/audit.domain";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Image } from "domains/social/media.domain";

export class RecipeStep extends Audit implements IInteractable {
  content: string;

  photos: Image[];

  nReactions: number;

  nComments: number;

  constructor(step: Partial<RecipeStep>) {
    super(step)
    this.content = step?.content
    this.photos = step?.photos
    this.nComments = step?.nComments
    this.nReactions = step?.nReactions
  }
}
