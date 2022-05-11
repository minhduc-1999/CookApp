import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Food } from "domains/core/food.domain";

export type FoodDocument = FoodItem & Document;

@Schema()
export class FoodItem {
  @Prop()
  _id: string

  @Prop()
  name: string;

  @Prop({ type: [String] })
  ingredients: string[];

  @Prop()
  servings: number

  @Prop({name: "total_time"})
  totalTime: number

  @Prop()
  description: string

  constructor(food:Food) {
    this._id = food?.id
    this.name = food?.name
    this.ingredients = food?.ingredients.map(ing => ing.name)
    this.servings = food?.servings
    this.totalTime = food?.totalTime
    this.description = food?.description
  }
}

export const FoodSchema = SchemaFactory.createForClass(FoodItem);

FoodSchema.index({ name: "text", description: "text" });

export const FoodModel: ModelDefinition = {
  name: FoodItem.name,
  schema: FoodSchema,
  collection: "foods",
}
