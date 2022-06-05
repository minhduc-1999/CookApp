import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  FoodResponse,
  PageMetadata,
  UserErrorCode,
} from "./base.type";
import { baseUrl, token } from "./token";

export const getUncensoredFood = async (
  page: number,
  limit: number,
  q = ""
): Promise<[FoodResponse[], PageMetadata]> => {
  await networkChecking();
  return axios
    .get(baseUrl + "/foods/uncensored", {
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

export const getFoods = async (
  page: number,
  limit: number,
  q = ""
): Promise<[FoodResponse[], PageMetadata]> => {
  await networkChecking();
  return axios
    .get(baseUrl + "/foods/censored", {
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

export const getFoodDetail = async (foodId: string): Promise<FoodResponse> => {
  await networkChecking();
  return axios
    .get(baseUrl + `/foods/${foodId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      throw new Error("Failed");
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
  videoUrl?: string | undefined;
  name: string;
  description: string | undefined;
  photos: string[];
};

export const canSaveFood = (food: CreateFoodBody) => {
  if (!food.name || !food.totalTime || !food.description) return false;
  if (!food.steps || !food.steps.length) return false;
  for (const step of food.steps) {
    if (!step || !step.content) return false;
  }
  if (!food.ingredients || !food.ingredients.length) return false;
  for (const ingre of food.ingredients) {
    if (!ingre.name || !ingre.unit || !ingre.quantity) return false;
  }
  if (!food.photos || !food.photos.length) return false;
  return true;
};

export const createFood = async (data: CreateFoodBody): Promise<void> => {
  await networkChecking();
  if (!data.videoUrl) delete data.videoUrl;
  return axios
    .post(baseUrl + "/foods", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 201) return;
      throw new Error("Fail");
    });
};

export const confirmFood = async (
  foodId: string,
  type: "confirmed" | "dismissed"
): Promise<void> => {
  await networkChecking();
  return axios
    .patch(
      baseUrl + `/foods/${foodId}/censorship`,
      {
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to confirm food");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.FOOD_ALREADY_CONFIRMED
      )
        return;
      throw new Error("Failed to confirm food");
    });
};
