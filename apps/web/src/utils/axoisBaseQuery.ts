import { type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { SerializedError } from "@reduxjs/toolkit";
import { env } from "@/env.ts";

export const axiosInstance = axios.create({
  baseURL: env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AxiosBaseQueryError extends SerializedError {
  status?: number;
  data?: {
    message?: string;
  };
}

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    AxiosBaseQueryError
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
      });

      return { data: result };
    } catch (error: unknown) {
      const axoisError = error as AxiosError;

      const serializedError = {
        error: {
          name: axoisError?.name,
          message: axoisError?.message,
          stack: axoisError?.stack,
          status: axoisError?.response?.status,
          data: axoisError?.response?.data || { message: axoisError.message },
        } satisfies AxiosBaseQueryError,
      };

      return serializedError;
    }
  };
