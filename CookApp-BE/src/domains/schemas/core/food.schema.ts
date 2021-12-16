import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
@Schema()
class Unit {
  @Prop()
  unit: string;
  @Prop()
  value: number;
}
const UnitSchema = SchemaFactory.createForClass(Unit);

@Schema()
class Ingredient {
  @Prop({ type: UnitSchema })
  unit: Unit;
  @Prop()
  name: string;
  @Prop()
  quantity: number;
}

const IngredientSchema = SchemaFactory.createForClass(Ingredient);

@Schema()
class Step {
  @Prop()
  content: string;
  @Prop()
  photos: string[];
}

const StepSchema = SchemaFactory.createForClass(Step);

@Schema()
export class Food extends AbstractSchema {
  @Prop({ default: 0 })
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

  @Prop({ type: [StepSchema] })
  @Type(() => Step)
  steps: Step[];

  @Prop({ type: [IngredientSchema] })
  @Type(() => Ingredient)
  ingredients: Ingredient[];

  @Prop()
  origin: string;
}

export type FoodDocument = Food & Document;

export const FoodSchema = SchemaFactory.createForClass(Food);

FoodSchema.index({ name: "text", description: "text" });

export const FoodModel: ModelDefinition = {
  name: Food.name,
  schema: FoodSchema,
  collection: "foods",
};
