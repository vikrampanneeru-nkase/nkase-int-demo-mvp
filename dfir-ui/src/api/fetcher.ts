// src/api/fetcher.ts
import apiClient from "./client";

export const fetcher = async (endpoint: string): Promise<any> => {
  console.log("fetcher endpoint is ",endpoint)
  const response = await apiClient.get(`/${endpoint}`);
  return response.data;
};
