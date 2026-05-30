// services/api.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Flag për të parandaluar refresh-in e shumëfishtë
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    const tenantId = localStorage.getItem("tenantId");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenantId && config.headers) {
      config.headers["x-tenant-id"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kontrollo nëse është 401 dhe nuk është tentuar refresh më parë
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nëse është në proces refresh, shto në queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          "http://localhost:3000/auth/refresh-token",
          {
            refreshToken,
          },
        );

        const { access_token, refresh_token } = response.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // Kontrollo nëse nuk është tashmë në login page për të shmangur loop
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes("/login");
        const isRegisterPage = currentPath.includes("/register");

        if (!isLoginPage && !isRegisterPage) {
          window.location.href = `/${localStorage.getItem("tenantSlug") || "tenant1"}/login`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
