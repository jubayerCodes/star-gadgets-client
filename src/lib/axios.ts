import { config } from "@/config";
import { ApiResponse } from "@/types";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (error.response?.data?.message === "jwt expired") {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (error) {
        processQueue(error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
