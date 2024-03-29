import axios from "axios";
import { baseUrl, token } from "./token";
import { IngredientResponse, PageMetadata } from "./base.type";

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
