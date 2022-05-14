import axios from "axios";
import { PageMetadata, TopicResponse } from "./base.type";
import { baseUrl, token } from "./token";

type CreateTopicBody = {
  title: string;
};

export const canSaveTopic = (body: CreateTopicBody) => {
  if (!body || !body.title) return false;
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
