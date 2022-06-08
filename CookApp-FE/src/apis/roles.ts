import axios from "axios";
import { networkChecking } from "utils/network";
import { PageMetadata, RoleResponse } from "./base.type";
import { apiUrl } from "./service.config";

export const getRoles = async (
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[RoleResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking()
  return axios
    .get(apiUrl + "/roles", {
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
