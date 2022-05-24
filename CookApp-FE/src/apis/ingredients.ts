import axios, { AxiosResponse } from "axios";
import { baseUrl, token } from "./token";
import { BaseResponse, IngredientResponse, PageMetadata } from "./base.type";
import { networkChecking } from "utils/network";

type CreateIngredientBody = {
  name: string;
};

export const canSaveIngredient = (body: CreateIngredientBody) => {
  if (!body) return false;
  if (!body.name) return false;
  return true;
};

export const getIngredients = async (
  page: number,
  limit: number,
  q = ""
): Promise<[IngredientResponse[], PageMetadata]> => {
  await networkChecking()
  return axios
    .get(baseUrl + "/ingredients", {
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
        return [res.data.data.ingredients, res.data.data.metadata];
      throw new Error("Fail");
    });
};

export const createIngredient = async (
  data: CreateIngredientBody
): Promise<void> => {
  await networkChecking()
  return axios
    .post(baseUrl + "/ingredients", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to create new ingredient");
    });
};
