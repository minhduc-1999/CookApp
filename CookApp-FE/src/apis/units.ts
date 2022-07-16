import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  PageMetadata,
  UnitResponse,
  UserErrorCode,
} from "./base.type";
import { apiUrl } from "./service.config";

type CreateUnitBody = {
  name: string;
  toGram: number;
};
export const canSaveUnit = (body: CreateUnitBody) => {
  if (!body) return false;
  if (!body.name) return false;
  if (!body.toGram) return false;
  return true;
};

export const getUnits = async (
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[UnitResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .get(apiUrl + "/units", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        offset: page - 1,
        limit,
        q,
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok)
        return [res.data.data.units, res.data.data.metadata];
      throw new Error("Failed");
    });
};

export const createUnit = async (
  data: CreateUnitBody,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .post(apiUrl + "/units", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to create new unit");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.UNIT_ALREADY_EXISTED
      )
        throw new Error("Unit has already existed");
      throw new Error("Failed to create new unit");
    });
};

export const deleteUnit = async (
  unitId: string,
  token: string | undefined
): Promise<void> => {
  await networkChecking();
  return axios
    .delete(apiUrl + `/units/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Fail to delete unit");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (err?.response?.status === 404) return;
      throw new Error("Fail to delete unit");
    });
};
