import axios, { type InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor-i që shton Token-in dhe Tenant ID në mënyrë dinamike
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
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nëse kërkesa dështon me 401 dhe nuk është provuar më parë
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Thirrje direkte pa interceptor për të shmangur loop-et
          const res = await axios.post(
            "http://localhost:3000/auth/refresh-token",
            { refreshToken },
          );
          const { access_token, refresh_token } = res.data;

          localStorage.setItem("token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return API(originalRequest); // Riprovo kërkesën origjinale
        } catch (refreshError) {
          // Nëse skadon edhe refresh token, fshi gjithçka dhe dërgoje në login
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default API;
