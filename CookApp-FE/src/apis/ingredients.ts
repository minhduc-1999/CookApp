import axios, { AxiosError, AxiosResponse } from "axios";
import { apiUrl } from "./service.config";
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
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[IngredientResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking();
  return axios
    .get(apiUrl + "/ingredients", {
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
  data: CreateIngredientBody, token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking();
  return axios
    .post(apiUrl + "/ingredients", data, {
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

export const deleteIngredient = async (ingredientId: string, token: string | undefined): Promise<void> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking();
  return axios
    .delete(apiUrl + `/ingredients/${ingredientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Fail to delete ingredient");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      console.log(err);
      if (err?.response?.status === 404) return;
      throw new Error("Fail to delete ingredient");
    });
};
