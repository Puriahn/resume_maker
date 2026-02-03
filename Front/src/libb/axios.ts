//@ts-nocheck
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken,setAccessToken,
  getRefreshToken,
  clearTokens, } from "./token";
export const base_url="http://localhost:8000/api/"
//export const base_url = "https://api.pri22.com/api/";
const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

// Flag to track if a refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Helper function to process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");
    const response = await api.post("/token/refresh/", { token: refreshToken });
    const newAccessToken = response.data.access_token;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    clearTokens();
    window.location.href = "/";
    return null;
  }
};

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration and retries
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error and that retry hasn't been attempted
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 500) {
      console.error("Server error:", error.response?.data);
    }

    return Promise.reject(error);
  },
);

export default api;
