export enum InteractiveTargetType {
  POST = "POST",
  POST_MEDIA = "POST_MEDIA",
  RECIPE_STEP = "RECIPE_STEP",
  ALBUM_MEDIA = "ALBUM_MEDIA",
  ALBUM = "ALBUM",
}

export enum ReactionType {
  LOVE = "LOVE",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}

export enum PostType {
  MOMENT = "MOMENT",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const SexEnum = ["male", "female", "other"];

export enum ConversationType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}

export enum MessageContentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  RECIPE = "RECIPE",
  INGREDIENT = "INGREDIENT",
}

export const BotActionType = {
  SHOW_INGREDIENT: "food.show-ingredient",
  SHOW_RECIPE: "food.show-recipe",
};
