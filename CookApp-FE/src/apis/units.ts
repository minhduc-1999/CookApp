import axios from "axios";
import { PageMetadata, UnitResponse } from "./base.type";
import { baseUrl, token } from "./token";

type CreateUnitBody = {
  name: string;
};
export const canSaveUnit = (body: CreateUnitBody) => {
  if (!body) return false;
  if (!body.name) return false;
  return true;
};

export const getUnits = async (
  page: number,
  limit: number,
  q = ""
): Promise<[UnitResponse[], PageMetadata]> => {
  return axios
    .get(baseUrl + "/units", {
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
        return [res.data.data.units, res.data.data.metadata];
      throw new Error("Fail");
    });
};
