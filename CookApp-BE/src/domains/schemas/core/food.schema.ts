import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";

export type FoodDocument = Food & Document;

@Schema()
export class Food extends AbstractSchema {
  @Prop({default: 0})
  servings: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  photos: string[];

  @Prop()
  totalTime: number;

  @Prop()
  cookingMethod: string[];

  @Prop()
  group: string;

  @Prop({type: [Object]})
  steps: Step[];

  @Prop({type: Object})
  ingredients: Ingredient;

  @Prop()
  origin: string
}

class Unit {
  @Prop()
  unit: string;
  @Prop()
  value: number;
}

class Ingredient {
  @Prop({type: Object})
  unit: Unit;
  @Prop()
  name: string;
  @Prop()
  quantity: number;
}

class Step {
  @Prop()
  content: string;
  @Prop()
  photo: string[];
}

export const FoodSchema = SchemaFactory.createForClass(Food);

export const FeedModel: ModelDefinition = {
  name: Food.name,
  schema: FoodSchema,
  collection: "foods",
};