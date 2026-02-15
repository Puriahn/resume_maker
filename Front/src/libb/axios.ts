//@ts-nocheck
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken,setAccessToken,
  getRefreshToken,
  clearTokens, } from "./token";
export const base_url="http://127.0.0.1:8000/api/users"
const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];


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

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken(); 
    if (!refreshToken) throw new Error("No refresh token available");


    const response = await axios.post(`${base_url}/token/refresh/`, { 
      refresh: refreshToken 
    });

    const newAccessToken = response.data.access; 
    await setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    await clearTokens(); 
    window.location.href = "Auth/signIn"; 
    return null;
  }
};

api.interceptors.request.use(
  async (config: AxiosRequestConfig) => { 
    try {
      const token = await getAccessToken(); 
      

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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
