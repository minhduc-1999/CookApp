import { Food } from "../../domains/core/food.domain";
import { Audit } from "../../domains/audit.domain";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { PostType } from "../../enums/social.enum";
import { PostMedia } from "./media.domain";
import { User } from "./user.domain";

export abstract class PostBase extends Audit implements IInteractable {
  constructor(post: Partial<PostBase>) {
    super(post);
    this.nComments = post?.nComments;
    this.nReactions = post?.nReactions;
    this.author = post?.author;
    this.content = post?.content;
    this.tags = post?.tags;
  }

  nReactions: number;

  nComments: number;

  author: User;

  content: string;

  type: PostType;

  tags: string[];

  abstract canCreate(): boolean;

  abstract update(data: Partial<PostBase>): Partial<PostBase>;
}

export class Moment extends PostBase {
  update(data: Partial<Moment>): Partial<Moment> {
    return {
      content: data.content ?? this.content,
      location: data.location ?? this.location,
      medias: data.medias ?? this.medias,
      tags: data.tags ?? this.tags,
    };
  }

  canCreate(): boolean {
    if (!this.content) return false;
    return true;
  }

  location?: string;

  medias?: PostMedia[];

  constructor(post: Partial<Moment>) {
    super(post);
    this.type = PostType.MOMENT;
    this.location = post?.location;
    this.medias = post?.medias;
  }
}

export class FoodShare extends PostBase {
  update(data: Partial<FoodShare>): Partial<FoodShare> {
    return {
      content: data.content ?? this.content,
      medias: data.medias ?? this.medias,
      tags: data.tags ?? this.tags,
      ref: data?.ref ?? this.ref,
    };
  }

  canCreate(): boolean {
    if (!this.content) return false;
    return true;
  }

  ref: Food;

  location?: string;

  medias?: PostMedia[];

  constructor(post: Partial<FoodShare>) {
    super(post);
    this.type = PostType.FOOD_SHARE;
    this.ref = post?.ref;
    this.location = post?.location;
    this.medias = post?.medias;
  }
}

export type RecommendationItem = {
  advice: string;
  foods: Food[];
};

export class Recommendation {
  should: RecommendationItem;

  shouldNot: RecommendationItem;

  constructor(should: RecommendationItem, shouldNot: RecommendationItem) {
    this.should = should;
    this.shouldNot = shouldNot;
  }
}

export class RecommendationPost extends PostBase {
  canCreate(): boolean {
    if (this.recommendation) return true;
    return false;
  }

  update(data: Partial<RecommendationPost>): Partial<RecommendationPost> {
    const newRecommendation = data?.recommendation;
    return {
      content: data.content ?? this.content,
      recommendation: {
        should: {
          advice:
            newRecommendation?.should?.advice ??
            this.recommendation.should.advice,
          foods:
            newRecommendation?.should?.foods ??
            this.recommendation.should.foods,
        },
        shouldNot: {
          advice:
            newRecommendation?.shouldNot?.advice ??
            this.recommendation.shouldNot.advice,
          foods:
            newRecommendation?.shouldNot?.foods ??
            this.recommendation.shouldNot.foods,
        },
      },
    };
  }

  recommendation: Recommendation;

  constructor(post: Partial<RecommendationPost>) {
    super(post);
    this.recommendation = post?.recommendation;
    this.type = PostType.RECOMMENDATION;
  }
}

export type Post = Moment | FoodShare | RecommendationPost;

export class SavedPost extends Audit {
  saver: User;
  post: Post;

  constructor(item: Partial<SavedPost>) {
    super(item);
    this.saver = item?.saver;
    this.post = item?.post;
  }
}
