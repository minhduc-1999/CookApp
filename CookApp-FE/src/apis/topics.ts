import axios from "axios";
import { PageMetadata, TopicResponse } from "./base.type";
import { baseUrl, token } from "./token";

type CreateTopicBody = {
  title: string;
  cover: string;
};

export const canSaveTopic = (body: CreateTopicBody) => {
  if (!body || !body.title || !body.cover) return false;
  return true;
};

export const getTopics = async (
  page: number,
  limit: number,
  q = ""
): Promise<[TopicResponse[], PageMetadata]> => {
  return axios
    .get(baseUrl + "/topics", {
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

export const createTopic = async (data: CreateTopicBody): Promise<void> => {
  return axios
    .post(baseUrl + "/topics", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 201) return;
      throw new Error("Fail");
    });
};
