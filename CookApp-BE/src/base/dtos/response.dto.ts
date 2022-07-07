import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  FoodShare,
  Moment,
  Post,
  Recommendation,
  RecommendationItem,
  RecommendationPost,
} from "domains/social/post.domain";
import { Topic, User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { MetaDTO } from "./responseMeta.dto";
import { Comment } from "domains/social/comment.domain";
import { Food } from "domains/core/food.domain";
import { Media } from "domains/social/media.domain";
import {
  ConversationType,
  MediaType,
  MessageContentType,
  PostType,
  ReactionType,
  Sex,
} from "enums/social.enum";
import { Audit } from "domains/audit.domain";
import { Reaction } from "domains/social/reaction.domain";
import {
  FoodIngredient,
  Ingredient,
  Unit,
} from "domains/core/ingredient.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { Album } from "domains/social/album.domain";
import { Conversation, Message } from "domains/social/conversation.domain";
import { FoodVote } from "domains/core/foodVote.domain";
import { RoleType } from "enums/system.enum";
import { Account, Role } from "domains/social/account.domain";
import { FoodSaveType } from "enums/core.enum";
import { CertificateStatus } from "constants/certificate.constant";
import { Certificate } from "domains/social/certificate.domain";
import { Request } from "domains/social/request.domain";
import { RequestStatus, RequestType } from "constants/request.constant";

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
    return new ResponseDTO(new MetaDTO(false, message, errorCode));
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
    this.createdAt = audit?.createdAt?.getTime();
    this.id = audit?.id;
    this.updatedAt = audit?.updatedAt?.getTime();
  }
}

export class MediaResponse {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: String })
  url: string;

  @ApiResponseProperty({ enum: MediaType })
  type: MediaType;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;

  @ApiResponseProperty({ enum: Number })
  numberOfComment?: number;

  @ApiResponseProperty({ enum: Number })
  numberOfReaction?: number;

  constructor(media: Media, reaction?: Reaction) {
    this.url = media?.url;
    this.type = media?.type;
    this.id = media?.id;
    this.reaction = reaction?.type;
    this.numberOfComment = media?.nComments;
    this.numberOfReaction = media?.nReactions;
  }
}

export class RoleResponse {
  @ApiResponseProperty({ type: String })
  title: string;

  @ApiResponseProperty({ type: String })
  sign: RoleType;

  constructor(role: Role) {
    this.title = role?.title;
    this.sign = role?.sign;
  }
}

export class AccountResponse {
  @ApiResponseProperty({ type: String })
  username: string;

  @ApiResponseProperty({ type: String })
  email: string;

  @ApiResponseProperty({ type: String })
  phone?: string;

  @ApiResponseProperty({ type: Boolean })
  emailVerified: boolean;

  @ApiResponseProperty({ type: RoleResponse })
  role: RoleResponse;

  constructor(account: Account) {
    this.username = account?.username;
    this.email = account?.email;
    this.phone = account?.phone;
    this.emailVerified = account?.emailVerified;
    this.role = account?.role && new RoleResponse(account.role);
  }
}

export class UserResponse extends AuditResponse {
  @ApiResponseProperty({ type: MediaResponse })
  avatar?: MediaResponse;

  @ApiResponseProperty({ type: String })
  displayName?: string;

  @ApiResponseProperty({ type: String })
  firstName?: string;

  @ApiResponseProperty({ type: String })
  lastName?: string;

  @ApiResponseProperty({ type: AccountResponse })
  account?: AccountResponse;

  constructor(user: User) {
    super(user);
    this.avatar = user?.avatar && new MediaResponse(user?.avatar);
    this.displayName = user?.displayName;
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
    this.account = user?.account && new AccountResponse(user?.account);
  }
}

export class AuthorResponse {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: MediaResponse })
  avatar: MediaResponse;

  @ApiResponseProperty({ type: String })
  displayName: string;

  @ApiResponseProperty({ type: Boolean })
  isNutritionist: boolean;

  constructor(user: User) {
    this.id = user?.id;
    this.avatar = new MediaResponse(user?.avatar);
    this.displayName = user?.displayName;
    this.isNutritionist = user.isNutritionist;
  }
}

export class UnitResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  name: string;

  constructor(unit: Unit) {
    super(unit);
    this.name = unit?.name;
  }
}

export class IngredientResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  name: string;

  constructor(ing: Ingredient) {
    super(ing);
    this.name = ing?.name;
  }
}

export class FoodIngredientResponse {
  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: Number })
  quantity: number;

  @ApiResponseProperty({ type: String })
  unit: string;

  constructor(ingre: FoodIngredient) {
    this.name = ingre?.name;
    this.quantity = ingre?.quantity;
    this.unit = ingre?.unit;
  }
}

export class FoodVoteResponse {
  @ApiResponseProperty({ type: Number })
  star: number;

  @ApiResponseProperty({ type: String })
  comment: string;

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse;

  constructor(vote: FoodVote) {
    this.star = vote?.star;
    this.comment = vote?.comment;
    this.author = vote?.author && new AuthorResponse(vote.author);
  }
}

export class RecipeStepResponse {
  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: MediaResponse })
  photos: MediaResponse[];

  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: Number })
  numberOfComment: number;

  @ApiResponseProperty({ type: Number })
  numberOfReaction: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction: ReactionType;

  constructor(step: RecipeStep, reaction?: Reaction) {
    this.content = step?.content;
    this.photos = step?.photos?.map((photo) => new MediaResponse(photo));
    this.id = step?.id;
    this.numberOfComment = step?.nComments;
    this.numberOfReaction = step?.nReactions;
    this.reaction = reaction?.type;
  }
}

export class FoodResponse extends AuditResponse {
  @ApiResponseProperty({ type: Number })
  servings: number;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  description: string;

  @ApiResponseProperty({ type: [MediaResponse] })
  photos: MediaResponse[];

  @ApiResponseProperty({ type: Number })
  totalTime: number;

  @ApiResponseProperty({ type: [String] })
  cookingMethod: string[];

  @ApiResponseProperty({ type: String })
  group: string;

  @ApiResponseProperty({ type: [RecipeStepResponse] })
  steps: RecipeStepResponse[];

  @ApiResponseProperty({ type: [FoodIngredientResponse] })
  ingredients: FoodIngredientResponse[];

  @ApiResponseProperty({ type: String })
  origin: string;

  @ApiResponseProperty({ type: String })
  videoUrl: string;

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse;

  @ApiResponseProperty({ type: Number })
  rating: number;

  @ApiResponseProperty({ enum: FoodSaveType })
  saveType: FoodSaveType;

  constructor(
    food: Food,
    steps?: RecipeStepResponse[],
    saveType?: FoodSaveType
  ) {
    super(food);
    this.saveType = saveType;
    this.servings = food?.servings;
    this.name = food?.name;
    this.description = food?.description;
    this.photos = food?.photos.map((photo) => new MediaResponse(photo));
    this.totalTime = food?.totalTime;
    this.steps = steps
      ? steps
      : food?.steps.map((step) => new RecipeStepResponse(step));
    this.ingredients = food?.ingredients.map(
      (ingredient) => new FoodIngredientResponse(ingredient)
    );
    this.videoUrl = food?.videoUrl;
    this.author = food?.author && new AuthorResponse(food.author);
    this.rating = food?.rating;
  }
}

export class CertificateResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  issueAt: string;

  @ApiResponseProperty({ type: String })
  issueBy: string;

  @ApiResponseProperty({ type: String })
  title: string;

  @ApiResponseProperty({ type: String })
  expireAt: string;

  @ApiResponseProperty({ type: MediaResponse })
  image: MediaResponse;

  @ApiResponseProperty({ type: String })
  number: string;

  @ApiResponseProperty({ type: String })
  note: string;

  @ApiResponseProperty({ enum: CertificateStatus })
  status: CertificateStatus;

  @ApiResponseProperty({ type: AuthorResponse })
  owner: AuthorResponse;


  constructor(cert: Certificate) {
    super(cert);
    this.issueBy = cert?.issueBy;
    this.issueAt = cert?.issueAt?.toISOString();
    this.title = cert?.title;
    this.expireAt = cert?.expireAt?.toISOString();
    this.image = cert?.image && new MediaResponse(cert.image);
    this.owner = cert?.owner && new AuthorResponse(cert.owner);
    this.status = cert?.status;
    this.note = cert?.note
    this.number = cert?.number
  }
}

export class RequestResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  note: string;

  @ApiResponseProperty({ enum: RequestStatus })
  status: RequestStatus;

  @ApiResponseProperty({ enum: RequestType })
  type: RequestType;

  @ApiResponseProperty({ type: AuthorResponse })
  sender: AuthorResponse;

  @ApiResponseProperty({ type: [CertificateResponse] })
  certificates: CertificateResponse[];

  constructor(request: Request) {
    super(request);
    this.status = request?.status;
    this.type = request?.type;
    this.sender = request?.sender && new AuthorResponse(request.sender);
    this.certificates = request?.certificates?.map(
      (cert) => new CertificateResponse(cert)
    );
    this.note = request?.note
  }
}

export class RecommendationItemResponse {
  @ApiResponseProperty({ type: String })
  advice: string;

  @ApiResponseProperty({ type: [FoodResponse] })
  foods: FoodResponse[];

  constructor(item: RecommendationItem) {
    this.advice = item?.advice;
    this.foods = item?.foods?.map((food) => new FoodResponse(food));
  }
}

export class RecommendationResponse {
  @ApiResponseProperty({ type: RecommendationItemResponse })
  should: RecommendationItemResponse;

  @ApiResponseProperty({ type: RecommendationItemResponse })
  shouldNot: RecommendationItemResponse;

  constructor(rec: Recommendation) {
    this.should = rec.should && new RecommendationItemResponse(rec.should);
    this.shouldNot =
      rec.shouldNot && new RecommendationItemResponse(rec.shouldNot);
  }
}

export class PostResponse extends AuditResponse {
  @ApiResponseProperty({ type: RecommendationResponse })
  recomendation: RecommendationResponse;

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: [MediaResponse] })
  medias: MediaResponse[];

  @ApiResponseProperty({ type: AuthorResponse })
  author: AuthorResponse;

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;

  @ApiResponseProperty({ enum: PostType })
  kind: PostType;

  @ApiResponseProperty({ type: Boolean })
  saved?: boolean;

  @ApiResponseProperty({ type: FoodResponse })
  ref?: FoodResponse;

  @ApiResponseProperty({ type: [String] })
  tags: string[];

  @ApiResponseProperty({ type: String })
  location: string;

  constructor(post: Post, reaction?: Reaction, saved?: boolean) {
    super(post);
    this.author = post?.author && new AuthorResponse(post?.author);
    this.numOfComment = post?.nComments;
    this.numOfReaction = post?.nReactions;
    this.kind = post?.type;
    this.reaction = reaction?.type;
    this.saved = saved;
    this.tags = post?.tags;
    this.content = post?.content;
    switch (post?.type) {
      case PostType.MOMENT:
        const moment = post as Moment;
        this.location = moment?.location;
        this.medias = moment?.medias?.map((media) => new MediaResponse(media));
        break;
      case PostType.FOOD_SHARE:
        const foodShare = post as FoodShare;
        this.ref = foodShare?.ref && new FoodResponse(foodShare.ref);
        this.medias = foodShare?.medias?.map(
          (media) => new MediaResponse(media)
        );
        break;
      case PostType.RECOMMENDATION:
        const recommendPost = post as RecommendationPost;
        this.recomendation =
          recommendPost.recommendation &&
          new RecommendationResponse(recommendPost.recommendation);
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
  numberOfReply: number;

  @ApiResponseProperty({ type: [MediaResponse] })
  medias: MediaResponse[];

  constructor(comment: Comment) {
    super(comment);
    this.id = comment?.id;
    this.user = new AuthorResponse(comment?.user);
    this.content = comment?.content;
    this.numberOfReply = comment?.nReplies;
    this.medias = comment.medias?.map((media) => new MediaResponse(media));
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

  @ApiResponseProperty({ type: String })
  bio?: string;

  constructor(profile: User) {
    this.height = profile?.height;
    this.weight = profile?.weight;
    this.birthDate = profile?.birthDate?.getTime();
    this.firstName = profile?.firstName;
    this.lastName = profile?.lastName;
    this.sex = profile?.sex;
    this.bio = profile?.bio;
  }
}

export class TopicResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  title: string;

  @ApiResponseProperty({ type: MediaResponse })
  cover: MediaResponse;

  constructor(topic: Topic) {
    super(topic);
    this.title = topic?.title;
    this.cover = topic?.cover && new MediaResponse(topic.cover);
  }
}

export class AlbumResponse extends AuditResponse {
  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  description: string;

  @ApiResponseProperty({ type: [MediaResponse] })
  medias?: MediaResponse[];

  @ApiResponseProperty({ type: AuthorResponse })
  owner: AuthorResponse;

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  @ApiResponseProperty({ enum: ReactionType })
  reaction?: ReactionType;

  constructor(album: Album, reaction?: Reaction) {
    super(album);
    this.name = album?.name;
    this.medias = album?.medias.map((media) => new MediaResponse(media));
    this.owner = album?.owner && new AuthorResponse(album.owner);
    this.description = album?.description;
    this.numOfComment = album?.nComments;
    this.numOfReaction = album?.nReactions;
    this.reaction = reaction?.type;
  }
}

@ApiExtraModels(RecipeStepResponse, FoodIngredientResponse)
export class BotResponse {
  @ApiResponseProperty({ type: String })
  text: string;

  @ApiProperty({
    type: "object",
    properties: {
      recipes: {
        type: "array",
        items: {
          $ref: getSchemaPath(RecipeStepResponse),
        },
      },
      ingredients: {
        type: "array",
        items: {
          $ref: getSchemaPath(FoodIngredientResponse),
        },
      },
    },
  })
  attachment: {
    recipes: RecipeStepResponse[];
    ingredients: FoodIngredientResponse[];
  };

  @ApiResponseProperty({ enum: MessageContentType })
  type: MessageContentType;

  @ApiResponseProperty({ type: String })
  sessionID: string;

  @ApiResponseProperty({ type: Boolean })
  endInteraction: boolean;

  constructor(
    text: string,
    end: boolean,
    sessionID?: string,
    attach?: RecipeStep[] | FoodIngredient[],
    attachType?: MessageContentType
  ) {
    this.text = text;
    if (attach && attach[0] instanceof RecipeStep) {
      this.attachment = {
        ...this.attachment,
        recipes: attach.map((at: any) => new RecipeStepResponse(at)),
      };
    }

    if (attach && attach[0] instanceof FoodIngredient) {
      this.attachment = {
        ...this.attachment,
        ingredients: attach.map((at: any) => new FoodIngredientResponse(at)),
      };
    }
    this.type = attachType;
    this.sessionID = sessionID;
    this.endInteraction = end;
  }
}

export class MessageResponse extends AuditResponse {
  @ApiProperty({
    type: String,
  })
  content: string;

  @ApiResponseProperty({ enum: MessageContentType })
  type: MessageContentType;

  @ApiResponseProperty({ type: AuthorResponse })
  sender: AuthorResponse;

  @ApiResponseProperty({ type: String })
  to: string;

  @ApiPropertyOptional({
    type: "object",
    properties: {
      width: {
        type: "number",
      },
      height: {
        type: "number",
      },
    },
  })
  config: {
    width: number;
    height: number;
  };

  constructor(msg: Message) {
    super(msg);
    this.to = msg?.to?.id;
    this.content = msg?.message?.content;
    this.type = msg?.message?.type;
    this.sender = msg?.sender && new AuthorResponse(msg.sender);
    this.config = msg?.message.config;
  }
}

export class ConversationResponse extends AuditResponse {
  @ApiResponseProperty({ enum: ConversationType })
  type: ConversationType;

  @ApiResponseProperty({ type: MessageResponse })
  lastMessage: MessageResponse;

  @ApiResponseProperty({ type: Boolean })
  readAll: boolean;

  @ApiResponseProperty({ type: [AuthorResponse] })
  members: AuthorResponse[];

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  cover: string;

  constructor(conv: Conversation, readAll?: boolean) {
    super(conv);
    this.type = conv?.type;
    this.lastMessage =
      conv?.lastMessage && new MessageResponse(conv.lastMessage);
    this.readAll = readAll;
    this.members = conv?.members?.map((user) => new AuthorResponse(user));
    this.cover = conv?.cover;
    this.name = conv?.name;
  }
}
