import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  CertificateStatus,
  PageMetadata,
  RequestResponse,
  RequestStatus,
  UserErrorCode,
} from "./base.type";
import { apiUrl } from "./service.config";

export const getWaitingRequest = async (
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[RequestResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .get(apiUrl + "/admin/requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        offset: page - 1,
        limit,
        q,
        status: RequestStatus.WAITING,
      },
    })
    .then((res) => {
      if (res.status === 200)
        return [res.data.data.requests, res.data.data.metadata];
      throw new Error("Fail");
    });
};

export const confirmRequest = async (
  requestId: string,
  type: RequestStatus,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .put(
      apiUrl + `/admin/requests/${requestId}/censorship`,
      {
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to confirm request");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.REQUEST_ALREADY_CONFIRMED
      )
        return;

      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.NEED_CONFIRM_ALL_CERT
      )
        throw new Error(
          "You have to confirm all certificates in the request first"
        );
      throw new Error("Failed to confirm request");
    });
};

export const confirmCert = async (
  certId: string,
  type: CertificateStatus,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error("Not login yet");
  await networkChecking();
  return axios
    .put(
      apiUrl + `/admin/certificates/${certId}/censorship`,
      {
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res: AxiosResponse<BaseResponse>) => {
      if (res.data.meta.ok) return;
      throw new Error("Failed to confirm certificate");
    })
    .catch((err: AxiosError<BaseResponse>) => {
      if (
        err?.response?.data.meta.errorCode ===
        UserErrorCode.CERTIFICATE_ALREADY_CONFIRMED
      )
        return;
      throw new Error("Failed to confirm certificate");
    });
};
