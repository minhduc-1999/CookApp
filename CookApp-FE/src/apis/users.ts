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

export const createUser = async (
  data: CreateSystemUserBody,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .post(apiUrl + "/admin/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to create new account");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.ACCOUNT_ALREADY_EXISTED
      )
        throw new Error("Account has already existed");
      throw new Error("Failed to create new account");
    });
};

export const checkPhoneConstrain = (username: string): Error | null => {
  if (!username) return new Error("Phone is required");
  const regex = /[0-9]{9,11}/g;
  if (regex.test(username)) return null;
  return new Error(
    "Phone only contain numbers and length is 9-11"
  );
};

export const checkUsernameConstrain = (username: string): Error | null => {
  if (!username) return new Error("Username is required");
  const regex = /[A-Za-z0-9_]{5,20}/g;
  if (regex.test(username)) return null;
  return new Error(
    "Username only contain a-z, A-Z, 0-9, _ characters and length is between 5-20"
  );
};

export const checkPasswordConstrain = (rawPassword: string): Error | null => {
  if (!rawPassword) return new Error("Password is required");
  const regex = /[A-Za-z0-9_]{8,20}/g;
  if (regex.test(rawPassword)) return null;
  return new Error(
    "Password is only contain a-z, A-Z, 0-9, _ characters and length is between 8-20"
  );
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
  if (!token) throw new Error("Not login yet");
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

export const changeRole = async (
  body: ChangeRoleBody,
  token: string | undefined
) => {
  if (!token) throw new Error("Not login yet");
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
