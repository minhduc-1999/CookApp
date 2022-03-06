import { ApiExtraModels, ApiProperty, ApiPropertyOptional, ApiResponseProperty, getSchemaPath } from "@nestjs/swagger";
import { Album, Moment, Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { ReactionType } from "enums/reaction.enum";
import { MetaDTO } from "./responseMeta.dto";
import { Comment } from "domains/social/comment.domain"
import { Sex } from "enums/sex.enum";
import { Profile } from "domains/social/profile.domain";
import { Food } from "domains/core/food.domain";

export class ResponseDTO<T> {
  constructor(meta: MetaDTO, data?: T) {
    this.data = data;
    this.meta = meta;
  }

  @ApiPropertyOptional()
  data?: T;

  @ApiProperty({ type: MetaDTO })
  meta: MetaDTO;

  public static ok(message: string, data?: any): ResponseDTO<any> {
    return new ResponseDTO(new MetaDTO(true, message), data);
  }

  public static fail(message: string, errorCode?: UserErrorCode) {
    return new ResponseDTO(new MetaDTO(false, message, errorCode))
  }
}

export class AuditResponse {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: Number })
  createdAt: number;

  @ApiResponseProperty({ type: Number })
  updatedAt?: number;

  @ApiResponseProperty({ type: String })
  updatedBy?: string;

  constructor(audit: Partial<AuditResponse>) {
    this.createdAt = audit?.createdAt
    this.id = audit?.id
    this.updatedAt = audit?.updatedAt
    this.updatedBy = audit?.updatedBy
  }
}


export class AuthorResponse {
  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: String })
  avatar: string

  @ApiResponseProperty({ type: String })
  displayName: string

  constructor(user: User) {
    this.id = user.id
    this.avatar = user.avatar
    this.displayName = user.displayName
  }
}

export class PostResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: [String] })
  images: string[];

  @ApiResponseProperty({ type: [String] })
  videos: string[];

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;

  @ApiResponseProperty({ enum: ["Album", "Moment"] })
  kind: "Album" | "Moment"

  constructor(post: Post) {
    super(post)
    this.author = new AuthorResponse(post?.author)
    this.numOfComment = post?.numOfComment;
    this.numOfReaction = post?.numOfReaction;
    this.kind = post?.kind
    switch (post?.kind) {
      case "Album":
        this.name = post?.name
        this.images = post?.images;
        this.videos = post?.videos;
        break;
      case "Moment":
        this.content = post?.content
        this.images = post?.images;
        this.videos = post?.videos;
        break;
    }
  }
}

export class CommentResponse extends AuditResponse {
  @ApiResponseProperty({ type: AuthorResponse })
  user: AuthorResponse;

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: Number })
  numberOfReply: number

  constructor(comment: Comment) {
    super(comment)
    this.id = comment?.id
    this.user = new AuthorResponse(comment?.user)
    this.content = comment?.content
    this.numberOfReply = comment?.numberOfReply
  }
}

export class ProfileResponse {
  @ApiResponseProperty({ type: Number })
  height?: number;

  @ApiResponseProperty({ type: Number })
  weight?: number;

  @ApiResponseProperty({ type: Number })
  birthDate?: number;

  @ApiResponseProperty({ type: String })
  firstName?: string;

  @ApiResponseProperty({ type: String })
  lastName?: string;

  @ApiResponseProperty({ enum: Sex })
  sex?: Sex;

  constructor(profile: Profile) {
    this.height = profile?.height
    this.weight = profile?.weight
    this.birthDate = profile?.birthDate
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.sex = profile?.sex
  }
}

export class MomentResponse {
  @ApiResponseProperty({ type: String })
  content: string

  @ApiResponseProperty({ type: [String] })
  images?: string[]

  @ApiResponseProperty({ type: [String] })
  videos?: string[]

  @ApiResponseProperty({ enum: ["Moment"] })
  kind: "Moment"

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: Number })
  createdAt: number

  constructor(post: Moment) {
    this.content = post?.content
    this.images = post?.images
    this.videos = post?.videos
    this.author = new AuthorResponse(post?.author)
    this.numOfReaction = post?.numOfReaction
    this.numOfComment = post?.numOfComment
    this.id = post?.id
    this.createdAt = post?.createdAt
  }
}

export class AlbumResponse {
  @ApiResponseProperty({ type: String })
  name: string

  @ApiResponseProperty({ type: [String] })
  images?: string[]

  @ApiResponseProperty({ type: [String] })
  videos?: string[]

  @ApiResponseProperty({ enum: ["Album"] })
  kind: "Album"

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: Number })
  createdAt: number

  constructor(post: Album) {
    this.name = post?.name
    this.images = post?.images
    this.videos = post?.videos
    this.author = new AuthorResponse(post?.author)
    this.numOfReaction = post?.numOfReaction
    this.numOfComment = post?.numOfComment
    this.id = post?.id
    this.createdAt = post?.createdAt
  }
}

export class IngredientResponse {

  @ApiResponseProperty({ type: String })
  name: string

  @ApiResponseProperty({
   type: "string | number" 
  })
  quantity: string | number

  @ApiResponseProperty({ type: String })
  unit: string

  constructor(name: string, quantity: string | number, unit: string) {
    this.name = name
    this.quantity = quantity
    this.unit = unit
  }
}

export class RecipeStepResponse {
  @ApiResponseProperty({ type: String })
  content: string

  @ApiResponseProperty({ type: String })
  photos: string[]

  @ApiResponseProperty({ type: String })
  id: string

  constructor(content: string, photos: string[], id: string) {
    this.content = content
    this.photos = photos
    this.id = id
  }
}

export class FoodResponse extends AuditResponse {
  @ApiResponseProperty({ type: Number })
  servings: number;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  description: string;

  @ApiResponseProperty({ type: String })
  photos: string[];

  @ApiResponseProperty({ type: Number })
  totalTime: number;

  @ApiResponseProperty({ type: [String] })
  cookingMethod: string[];

  @ApiResponseProperty({ type: String })
  group: string;

  @ApiResponseProperty({ type: [RecipeStepResponse] })
  steps: RecipeStepResponse[];

  @ApiResponseProperty({ type: [IngredientResponse] })
  ingredients: IngredientResponse[]

  @ApiResponseProperty({ type: String })
  origin: string;

  @ApiResponseProperty({ type: String })
  videoUrl: string;

  constructor(food: Food) {
    super(food)
    this.servings = food?.servings
    this.name = food?.name
    this.description = food?.description
    this.photos = food?.photos
    this.totalTime = food?.totalTime
    this.cookingMethod = food?.cookingMethod
    this.group = food?.group
    this.steps = food?.steps.map(step =>
      new RecipeStepResponse(step.content, step.photos, step.id))
    this.ingredients = food?.ingredients.map(ingredient =>
      new IngredientResponse(ingredient.name, ingredient.quantity, ingredient.unit)
    )
    this.origin = food?.origin
    this.videoUrl = food?.videoUrl
  }
}
