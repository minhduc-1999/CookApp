import { Audit } from "../../domains/audit.domain";
import { Image, Video } from "../../domains/social/media.domain";
import { Ingredient } from "./ingredient.domain";
import { RecipeStep } from "./recipeStep.domain";

export class Food extends Audit {
  servings: number;

  name: string;

  description: string;

  photos: (Image | Video)[];

  totalTime: number;

  steps: RecipeStep[];

  ingredients: Ingredient[];

  videoUrl: string;

  url: string;

  constructor(food: Partial<Food>) {
    super(food)
    this.servings = food?.servings
    this.name = food?.name
    this.description = food?.description
    this.photos = food?.photos ?? []
    this.totalTime = food?.totalTime
    this.steps = food?.steps ?? []
    this.ingredients = food?.ingredients ?? []
    this.videoUrl = food?.videoUrl
    this.url = food?.url
  }
}
