import axios from "axios";
import { PageMetadata, UserResponse } from "./base.type";
import { baseUrl, token } from "./token";

export type CreateSystemUserBody = {
  username: string,
  rawPassword: string,
  email: string,
  phone: string,
  role: string
}

export const checkPasswordConstrain = (rawPassword: string) => {
  if (!rawPassword) return false
  const regex = /[A-Za-z0-9_]{8,20}/g
  if (regex.test(rawPassword))
    return true
  return false
}

export const canSaveSystemUser = (body: CreateSystemUserBody)  => {
  if (!body.username)
    return false
  if (!checkPasswordConstrain(body.rawPassword))
    return false
  return true
}

export const getUsers = async (
  page: number,
  limit: number,
  q = ""
): Promise<[UserResponse[], PageMetadata]> => {
  return axios
    .get(baseUrl + "/users", {
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
        return [res.data.data.users, res.data.data.metadata];
      throw new Error("Fail");
    });
};
