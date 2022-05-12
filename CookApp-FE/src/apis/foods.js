import axios from "axios"
import { token } from "./token"

const baseUrl = "http://localhost:3002/api";

export const getFoods = async (page, limit, q = "") => {
  return axios.get(baseUrl + "/foods", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    params: {
      offset: page - 1,
      limit,
      q
    }
  }).then(res => {
    if (res.status === 200) return res.data.data
    throw new Error("Fail")
  })
}
