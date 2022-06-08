export enum UserErrorCode {
  ACCOUNT_ALREADY_EXISTED = "account_already_existed",
  INVALID_CREDENTIAL = "invalid_credential",
  USER_NOT_FOUND = "user_not_found",
  INVALID_ID = "invalid_id",
  INVALID_OWNER = "invalid_owner",
  DISPLAY_NAME_ALREADY_IN_USE = "display_name_already_in_use",
  INVALID_TOKEN = "invalid_token",
  POST_NOT_FOUND = "post_not_found",
  POST_NOT_SAVED = "post_not_saved",
  POST_SAVED_ALREADY = "post_saved_already",
  COMMENT_NOT_FOUND = "comment_not_found",
  FOOD_NOT_FOUND = "food_not_found",
  ALBUM_NOT_FOUND = "album_not_found",
  CONVERSATION_NOT_FOUND = "conversation_not_found",
  MESSAGE_NOT_FOUND = "message_not_found",
  VOTE_NOT_FOUND = "vote_not_found",
  UNIT_ALREADY_EXISTED = "unit_already_existed",
  INGREDIENT_ALREADY_EXISTED = "ingredient_already_existed",
  TOPIC_ALREADY_EXISTED = "topic_already_existed",
  FOOD_ALREADY_CONFIRMED = "food_already_confirmed",
  FOOD_ALREADY_SAVED = "food_already_saved",
  OLD_PASSWORD_NOT_CORRECT = "old_password_not_correct",
  FOOD_NOT_SAVE = "food_not_save",
}

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

export type MediaType = "IMAGE" | "VIDEO" | "AUDIO";

export enum PostType {
  MOMENT = "MOMENT",
  FOOD_SHARE = "FOOD_SHARE",
  RECOMMENDATION = "RECOMMENDATION",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export type RoleType = "sys-admin" | "user" | "nutritionist" | "manager";

export const SexEnum = ["male", "female", "other"];

export enum ConversationType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}

export type BaseResponse<T = any> = {
  meta: {
    messages: [string];
    ok: boolean;
    errorCode?: UserErrorCode;
  };
  data: T;
};

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

export type PageMetadata = {
  totalPage: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type MetaDTO = {
  messages?: [string];

  ok: boolean;

  errorCode?: UserErrorCode;
};

export type ResponseDTO<T> = {
  data?: T;

  meta: MetaDTO;
};

export type AuditResponse = {
  id: string;

  createdAt: number;

  updatedAt?: number;
};

export type MediaResponse = {
  id?: string;

  url: string;

  type: MediaType;

  reaction?: ReactionType;

  numberOfComment?: number;

  numberOfReaction?: number;
};

export type AuthorResponse = {
  id: string;

  avatar: MediaResponse;

  displayName: string;
};

export type RoleResponse = {
  title: string;
  sign: RoleType;
};

export type LoginResponse = {
  loginToken: string;
  accessToken: string;
  userId: string;
  email: string;
  emailVerified: boolean;
  role: RoleType;
};

export type UserResponse = AuditResponse & {
  avatar: MediaResponse;
  displayName: string;
  account: {
    username: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    role: {
      title: string;
      sign: RoleType;
    };
  };
};

export type UnitResponse = {
  name: string;
} & AuditResponse;

export type IngredientResponse = {
  name: string;
} & AuditResponse;

export type FoodIngredientResponse = {
  name: string;

  quantity: number;

  unit: string;
};

export type FoodVoteResponse = {
  star: number;

  comment: string;

  author: AuthorResponse;
};

export type RecipeStepResponse = {
  content: string;

  photos: MediaResponse[];

  id: string;

  numberOfComment: number;

  numberOfReaction: number;

  reaction: ReactionType;
};

export type FoodResponse = AuditResponse & {
  servings: number;

  name: string;

  description: string;

  photos: MediaResponse[];

  totalTime: number;

  cookingMethod: string[];

  group: string;

  steps: RecipeStepResponse[];

  ingredients: FoodIngredientResponse[];

  origin: string;

  videoUrl: string;

  author: AuthorResponse;

  rating: number;
};

export type RecommendationItemResponse = {
  advice: string;

  foods: FoodResponse[];
};

export type RecommendationResponse = {
  should: RecommendationItemResponse;

  shouldNot: RecommendationItemResponse;
};

export type PostResponse = {
  recomendation: RecommendationResponse;

  content: string;

  name: string;

  medias: MediaResponse[];

  author: AuthorResponse;

  numOfReaction: number;

  numOfComment: number;

  reaction?: ReactionType;

  kind: PostType;

  saved?: boolean;

  ref?: FoodResponse;

  tags: string[];

  location: string;
};

export type CommentResponse = {
  user: AuthorResponse;

  content: string;

  numberOfReply: number;

  medias: MediaResponse[];
};

export type ProfileResponse = {
  height?: number;

  weight?: number;

  birthDate?: number;

  firstName?: string;

  lastName?: string;

  sex?: Sex;

  bio?: string;
};

export type TopicResponse = AuditResponse & {
  title: string;
  cover: MediaResponse;
};

export type AlbumResponse = {
  name: string;

  description: string;

  medias?: MediaResponse[];

  owner: AuthorResponse;

  numOfReaction: number;

  numOfComment: number;

  reaction?: ReactionType;
};

export type BotResponse = {
  text: string;

  attachment: {
    recipes: RecipeStepResponse[];
    ingredients: FoodIngredientResponse[];
  };

  type: MessageContentType;

  sessionID: string;

  endInteraction: boolean;
};

export type MessageResponse = {
  content: string;

  type: MessageContentType;

  sender: AuthorResponse;

  to: string;
};

export type ConversationResponse = {
  type: ConversationType;

  lastMessage: MessageResponse;

  readAll: boolean;

  members: AuthorResponse[];

  name: string;

  cover: string;
};
