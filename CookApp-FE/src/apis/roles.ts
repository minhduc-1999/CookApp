import axios from "axios";
import { PageMetadata, RoleResponse } from "./base.type";
import { baseUrl, token } from "./token";

export const getRoles = async (
  page: number,
  limit: number,
  q = ""
): Promise<[RoleResponse[], PageMetadata]> => {
  return axios
    .get(baseUrl + "/roles", {
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
        return [res.data.data.roles, res.data.data.metadata];
      throw new Error("Fail");
    });
};
