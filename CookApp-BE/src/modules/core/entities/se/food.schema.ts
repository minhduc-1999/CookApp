import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
}

export const FoodSchema = SchemaFactory.createForClass(FoodItem);

FoodSchema.index({ name: "text", description: "text" });

export const FoodModel: ModelDefinition = {
  name: FoodItem.name,
  schema: FoodSchema,
  collection: "foods",
}
