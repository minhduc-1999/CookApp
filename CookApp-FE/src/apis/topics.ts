import axios, { AxiosError, AxiosResponse } from "axios";
import { networkChecking } from "utils/network";
import {
  BaseResponse,
  PageMetadata,
  TopicResponse,
  UserErrorCode,
} from "./base.type";
import { apiUrl } from "./service.config";

type CreateTopicBody = {
  title: string;
  cover: string;
};

export const canSaveTopic = (body: CreateTopicBody) => {
  if (!body || !body.title || !body.cover) return false;
  return true;
};

export const getTopics = async (
  token: string | undefined,
  page: number,
  limit: number,
  q = ""
): Promise<[TopicResponse[], PageMetadata]> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking()
  return axios
    .get(apiUrl + "/topics", {
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
        return [res.data.data.topics, res.data.data.metadata];
      throw new Error("Fail");
    });
};

export const createTopic = async (data: CreateTopicBody, token: string | undefined): Promise<void> => {
  if (!token) throw new Error("Not login yet")
  await networkChecking()
  try {
    const res = await axios.post(apiUrl + "/topics", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 201) return;
  } catch (err) {
    if (err instanceof AxiosError) {
      const res: AxiosResponse<BaseResponse> | undefined = err.response;
      if (
        res?.status === 409 &&
        res?.data?.meta.errorCode === UserErrorCode.TOPIC_ALREADY_EXISTED
      )
        throw new Error("Topic is already existed");
    }
    throw new Error("Failed to create topic");
  }
};
