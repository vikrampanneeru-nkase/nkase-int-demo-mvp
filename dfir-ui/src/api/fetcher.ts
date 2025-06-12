// src/api/fetcher.ts
import apiClient from "./client";

export const fetcher = async (endpoint: string): Promise<any> => {
  const response = await apiClient.get(`/${endpoint}`);
  return response.data;
};
