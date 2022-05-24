import axios, { AxiosError } from "axios";
import { networkChecking } from "utils/network";
import { BaseResponse, LoginResponse, UserErrorCode } from "./base.type";
import { baseUrl, token } from "./token";

export type Credential = {
  username: string;
  password: string;
};

export const validateUsername = (username: string) => {
  if (!username) return new Error("Username is required");
  const invalidCharRegex = /[^a-zA-Z0-9]/g;
  if (invalidCharRegex.test(username))
    return new Error(
      "Username must only contain following characters: a-z, A-z, 0-9."
    );
  const lengthCheckRegex = /^.{3,20}$/g;
  if (!lengthCheckRegex.test(username))
    return new Error("Username's length must be between 3 and 20.");
  return null;
};

export const validatePassword = (password: string) => {
  if (!password) return new Error("Password is required");
  const invalidCharRegex = /[^a-zA-Z0-9]/g;
  if (invalidCharRegex.test(password))
    return new Error(
      "Password must only contain following characters: a-z, A-z, 0-9."
    );
  const lengthCheckRegex = /^.{8,20}$/g;
  if (!lengthCheckRegex.test(password))
    return new Error("Password's length must be at least 8.");
  return null;
};

export const login = async (data: Credential): Promise<LoginResponse> => {
  await networkChecking()
  return axios
    .post(baseUrl + "/login", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err.response?.data.meta.errorCode === UserErrorCode.INVALID_CREDENTIAL
      )
        throw new Error("Wrong username or password");
      throw new Error("Login failed");
    });
};
