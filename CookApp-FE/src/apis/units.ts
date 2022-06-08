import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  PageMetadata,
  UnitResponse,
  UserErrorCode,
} from "./base.type";
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
  await networkChecking();
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
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok)
        return [res.data.data.units, res.data.data.metadata];
      throw new Error("Failed");
    });
};

export const createUnit = async (data: CreateUnitBody): Promise<void> => {
  await networkChecking();
  return axios
    .post(baseUrl + "/units", data, {
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

export const deleteUnit = async (unitId: string): Promise<void> => {
  await networkChecking();
  return axios
    .delete(baseUrl + `/units/${unitId}`, {
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
      if (err?.response?.status === 404) return
      throw new Error("Fail to delete unit");
    });
};
