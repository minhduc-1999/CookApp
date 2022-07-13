import { User } from "domains/social/user.domain";
import { FoodStatusType } from "../../enums/core.enum";
import { RoleType } from "../../enums/system.enum";
import { Audit } from "../../domains/audit.domain";
import { Image, Video } from "../../domains/social/media.domain";
import { FoodIngredient } from "./ingredient.domain";
import { RecipeStep } from "./recipeStep.domain";

export class Food extends Audit {
  servings: number;

  name: string;

  description: string;

  photos: (Image | Video)[];

  totalTime: number;

  steps: RecipeStep[];

  ingredients: FoodIngredient[];

  videoUrl: string;

  url: string;

  author: User;

  rating: number;

  status: FoodStatusType;

  kcal: number

  isValidFood(): boolean {
    if (this.photos?.length < 1) return false;
    if (this.steps?.length < 1) return false;
    return true;
  }

  setCensoredStatus(creatorRole: RoleType) {
    if (creatorRole === "sys-admin") {
      this.status = FoodStatusType.CONFIRMED;
    } else {
      this.status = FoodStatusType.UNCENSORED;
    }
  }

  constructor(food: Partial<Food>) {
    super(food);
    this.servings = food?.servings;
    this.name = food?.name;
    this.description = food?.description;
    this.photos = food?.photos ?? [];
    this.totalTime = food?.totalTime;
    this.steps = food?.steps ?? [];
    this.ingredients = food?.ingredients ?? [];
    this.videoUrl = food?.videoUrl;
    this.url = food?.url;
    this.author = food?.author;
    this.rating = food?.rating;
    this.status = food?.status
    this.kcal = food?.kcal
  }
}
