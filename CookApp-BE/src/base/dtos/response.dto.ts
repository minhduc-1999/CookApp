import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";
import { Album, Moment, Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { MetaDTO } from "./responseMeta.dto";
import { Comment } from "domains/social/comment.domain"
import { Food } from "domains/core/food.domain";
import { Media } from "domains/social/media.domain";
import { MediaType, PostType, ReactionType, Sex } from "enums/social.enum";
import { Audit } from "domains/audit.domain";
import { Reaction } from "domains/social/reaction.domain";

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

  constructor(audit: Audit) {
    this.createdAt = audit?.createdAt?.getTime()
    this.id = audit?.id
    this.updatedAt = audit?.updatedAt?.getTime()
  }
}

export class MediaResponse {
  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: String })
  key: string

  @ApiResponseProperty({ type: String })
  url: string

  @ApiResponseProperty({ enum: MediaType })
  type: MediaType

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType

  @ApiResponseProperty({ enum: Number })
  numberOfComment?: number

  constructor(media: Media, reaction?: Reaction, nComents?: number) {
    this.key = media?.key
    this.url = media?.url
    this.type = media?.type
    this.id = media?.id
    this.reaction = reaction?.type
    this.numberOfComment = nComents
  }
}

export class AuthorResponse {
  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: MediaResponse })
  avatar: MediaResponse

  @ApiResponseProperty({ type: String })
  displayName: string

  constructor(user: User) {
    this.id = user?.id
    this.avatar = new MediaResponse(user?.avatar)
    this.displayName = user?.displayName
  }
}

export class PostResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: [MediaResponse] })
  medias: MediaResponse[];

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;

  @ApiResponseProperty({ enum: PostType })
  kind: PostType

  @ApiResponseProperty({ type: String })
  location: string

  @ApiResponseProperty({ type: Boolean })
  saved?: boolean

  constructor(post: Post, reaction?: Reaction, saved?: boolean) {
    super(post)
    this.author = new AuthorResponse(post?.author)
    this.numOfComment = post?.nComments;
    this.numOfReaction = post?.nReactions;
    this.kind = post?.type
    this.location = post?.location
    this.medias = post?.medias.map(media => new MediaResponse(media));
    this.reaction = reaction?.type
    this.saved = saved
    switch (post?.type) {
      case PostType.ALBUM:
        const album = post as Album
        this.name = album?.name
          ;
        break;
      case PostType.MOMENT:
        const moment = post as Moment
        this.content = moment?.content
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
    this.numberOfReply = comment?.nReplies
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

  constructor(profile: User) {
    this.height = profile?.height
    this.weight = profile?.weight
    this.birthDate = profile?.birthDate?.getTime()
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.sex = profile?.sex
  }
}

export class MomentResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  content: string

  @ApiResponseProperty({ type: [MediaResponse] })
  medias?: MediaResponse[]

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
    super(post)
    this.content = post?.content
    this.medias = post?.medias.map(media => new MediaResponse(media));
    this.author = new AuthorResponse(post?.author)
    this.numOfReaction = post?.nReactions
    this.numOfComment = post?.nComments
  }
}

export class AlbumResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  name: string

  @ApiResponseProperty({ type: [MediaResponse] })
  medias?: MediaResponse[]

  @ApiResponseProperty({ enum: ["Album"] })
  kind: "Album"

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  constructor(post: Album) {
    super(post)
    this.name = post?.name
    this.medias = post?.medias.map(media => new MediaResponse(media));
    this.author = new AuthorResponse(post?.author)
    this.numOfReaction = post?.nReactions
    this.numOfComment = post?.nComments
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

  @ApiResponseProperty({ type: MediaResponse })
  photos: MediaResponse[]

  @ApiResponseProperty({ type: String })
  id: string

  constructor(content: string, photos: MediaResponse[], id: string) {
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

  @ApiResponseProperty({ type: MediaResponse })
  photos: MediaResponse[];

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
    this.photos = food?.photos.map(photo => new MediaResponse(photo));
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
