import axios from "axios";
import { HttpStatusCode } from "axios";
import { GuestResponse } from "../feature/Login/api";

let isRefreshing = false; // Tracks if a refresh token request is in progress
let refreshSubscribers: ((token: string) => void)[] = []; // Queue for waiting requests

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to get cookie value
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return match ? decodeURIComponent(match[1]) : null;
};

// Function to set cookie value
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
};

// Function to process subscribers waiting for the new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request Interceptor - เพิ่ม Authorization Header จาก Cookie
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // ดึง Token จาก Cookie
    const token = getCookie("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = getCookie("accessToken");
    if (
      token &&
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.Unauthorized
    ) {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error); // Abort if there's no original request
      }

      // If already refreshing, add the current request to the queue
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            if (!originalRequest.headers) {
              originalRequest.headers = {} as axios.AxiosRequestHeaders;
            }
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      // Start refresh token process
      isRefreshing = true;

      // ถ้้า 403 เเละมี Token จาก Cookie
      // ขอ access token ใหม่จาก refresh token
      try {
        const refreshResponse =
          await axiosInstance.post<GuestResponse>("/api/auth/refresh");

        const newToken = refreshResponse.data.accessToken;
        // ขอ access token ใหม่จาก refresh token สำเร็จ
        setCookie("accessToken", newToken, 7);

        // Notify all subscribers with the new token
        onRefreshed(newToken);

        // Retry the original request
        if (!originalRequest.headers) {
          originalRequest.headers = {} as axios.AxiosRequestHeaders;
        }
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        refreshSubscribers = [];

        // ขอ access token ใหม่จาก refresh token ไม่สำเร็จ
        console.error("Error during refresh token:", error);
        window.location.href = "/";
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      console.error("API Error:", error.response.data || error.message);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
