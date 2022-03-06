import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { Food } from "domains/core/food.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";

class IngredientModel {
  unit: string;

  name: string;

  quantity: number | string;
}

@Schema()
class RecipeStepModel extends AbstractSchema {
  @Prop()
  content: string;

  @Prop()
  photos: string[];

  static toDomain(step: RecipeStepModel): RecipeStep {
    return new RecipeStep({
      id: step._id,
      content: step.content,
      photos: step.photos
    })
  }
}

const StepSchema = SchemaFactory.createForClass(RecipeStepModel);

@Schema()
export class FoodModel extends AbstractSchema {
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
  @Type(() => RecipeStepModel)
  steps: RecipeStepModel[];

  @Type(() => IngredientModel)
  @Prop({ type: [{}]})
  ingredients: IngredientModel[];

  @Prop()
  origin: string;

  @Prop()
  videoUrl: string;

  static toDomain(food: FoodModel): Food {
    return new Food({
      id: food._id,
      createdAt: food.createdAt,
      totalTime: food.totalTime,
      steps: food.steps.map(step => RecipeStepModel.toDomain(step)),
      photos: food.photos,
      ingredients: food.ingredients,
      cookingMethod: food.cookingMethod,
      origin: food.origin,
      videoUrl: food.videoUrl,
      servings: food.servings,
      description: food.description,
      name: food.name,
      group: food.group
    })
  }
}

export type FoodDocument = FoodModel & Document;

export const FoodSchema = SchemaFactory.createForClass(FoodModel);

FoodSchema.index({ name: "text", description: "text" });

export const FoodModelDefinition: ModelDefinition = {
  schema: FoodSchema,
  name: FoodModel.name,
  collection: "foods"
}
