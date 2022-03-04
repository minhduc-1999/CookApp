import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";
import { Album, Moment, Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { ReactionType } from "enums/reaction.enum";
import { MetaDTO } from "./responseMeta.dto";
import { Comment } from "domains/social/comment.domain"
import { Sex } from "enums/sex.enum";
import { Profile } from "domains/social/profile.domain";

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

export class PostResponse {
  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: Number })
  createdAt: number

  @ApiResponseProperty({ type: Number })
  updatedAt?: number

  @ApiResponseProperty({ type: String })
  updatedBy?: string

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
    this.id = post.id
    this.createdAt = post.createdAt
    this.updatedAt = post.updatedAt
    this.updatedBy = post.updatedBy
    this.author = new AuthorResponse(post.author)
    this.numOfComment = post.numOfComment;
    this.numOfReaction = post.numOfReaction;
    this.kind = post.kind
    switch (post.kind) {
      case "Album":
        this.name = post.name
        this.images = post.images;
        this.videos = post.videos;
        break;
      case "Moment":
        this.content = post.content
        this.images = post.images;
        this.videos = post.videos;
        break;
    }
  }
}

export class CommentResponse {
  @ApiResponseProperty({ type: AuthorResponse })
  user: AuthorResponse;

  @ApiResponseProperty({ type: String })
  id: string

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: Number })
  numberOfReply: number

  constructor(comment: Comment) {
    this.id = comment.id
    this.user = new AuthorResponse(comment.user)
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
