import axios, { AxiosRequestConfig } from "axios";

/**
 * RapidAPI 统一请求函数
 * @param options - Axios 请求配置
 * @param apiHost - API Host（可选，默认使用 RAPIDAPI_TWITTER_HOST 或 twitter241.p.rapidapi.com）
 */
export const rapidapiRequest = async (
  options: AxiosRequestConfig,
  apiHost?: string
) => {
  const host = apiHost || process.env.RAPIDAPI_TWITTER_HOST || "twitter241.p.rapidapi.com";
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not configured");
  }

  const instance = axios.create({
    baseURL: `https://${host}`,
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": host,
    },
  });

  return instance.request(options);
};
