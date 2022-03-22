import { Audit } from "domains/audit.domain";
import { Image } from "domains/social/media.domain";
import { RecipeStep } from "./recipeStep.domain";


export class Food extends Audit {
  servings: number;

  name: string;

  description: string;

  photos: Image[];

  totalTime: number;

  cookingMethod: string[];

  group: string;

  steps: RecipeStep[];

  ingredients: {
    name: string
    quantity: string | number
    unit: string
  }[];

  origin: string;

  videoUrl: string;

  constructor(food: Partial<Food>) {
    super(food)
    this.servings = food?.servings
    this.name = food?.name
    this.description = food?.description
    this.photos = food?.photos ?? []
    this.totalTime = food?.totalTime
    this.cookingMethod = food?.cookingMethod
    this.group = food?.group
    this.steps = food?.steps ?? []
    this.ingredients = food?.ingredients ?? []
    this.origin = food?.origin
    this.videoUrl = food?.videoUrl
  }
}
