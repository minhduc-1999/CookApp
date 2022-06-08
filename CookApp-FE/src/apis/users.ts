import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  PageMetadata,
  UserErrorCode,
  UserResponse,
} from "./base.type";
import { apiUrl } from "./service.config";

export type CreateSystemUserBody = {
  username: string;
  rawPassword: string;
  email: string;
  phone: string;
  role: string;
};

export const checkPasswordConstrain = (rawPassword: string) => {
  if (!rawPassword) return false;
  const regex = /[A-Za-z0-9_]{8,20}/g;
  if (regex.test(rawPassword)) return true;
  return false;
};

export const canSaveSystemUser = (body: CreateSystemUserBody) => {
  if (!body.username) return false;
  if (!checkPasswordConstrain(body.rawPassword)) return false;
  return true;
};

export const getUsers = async (
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[UserResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking();
  return axios
    .get(apiUrl + "/admin/users", {
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

type ChangeRoleBody = {
  sign: string;
  userId: string;
};

export const changeRole = async (body: ChangeRoleBody, token: string | undefined) => {
  if (!token) throw new Error("Not login yet")
  await networkChecking();
  return axios
    .put(apiUrl + "/admin/change-role", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to change role");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (err?.response?.data.meta.errorCode === UserErrorCode.ROLE_NOT_FOUND)
        throw new Error("Role not found");
      throw new Error("Failed to change role");
    });
};
