import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-tenant-id"] = "47bfc312-ad9a-47aa-b1b4-a42a64284111";

  return config;
});

export default api;
