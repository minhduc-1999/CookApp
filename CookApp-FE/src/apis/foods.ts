import axios from "axios";
import { FoodResponse, PageMetadata } from "./base.type";
import { token } from "./token";

const baseUrl = "http://localhost:3002/api";

export const getFoods = async (
  page: number,
  limit: number,
  q = ""
): Promise<[FoodResponse[], PageMetadata]> => {
  return axios
    .get(baseUrl + "/foods", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        offset: page - 1,
        limit,
        q,
      },
    })
    .then((res) => {
      if (res.status === 200)
        return [res.data.data.foods, res.data.data.metadata];
      throw new Error("Fail");
    });
};

export type CreateFoodBody = {
  servings: number;
  totalTime: number;
  steps: {
    content: string;
    photos?: string[];
  }[];
  ingredients: {
    name: string;
    unit: string;
    quantity: number;
  }[];
  videoUrl?: string;
  name: string;
  description?: string;
  photos: string[];
  url?: string;
};

export const canSaveFood = (food: CreateFoodBody) => {
  if (!food.name || !food.totalTime) return false;
  if (!food.steps || !food.steps.length) return false;
  if (!food.ingredients || !food.ingredients.length) return false;
  if (!food.photos || !food.photos.length) return false;
  return true;
};

export const createFood = async (data: CreateFoodBody): Promise<void> => {
  return axios
    .post(baseUrl + "/foods", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    })
    .then((res) => {
      if (res.status === 201) return;
      throw new Error("Fail");
    });
};
