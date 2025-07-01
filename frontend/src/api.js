import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiPrivate.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;
    if (error.response.status == 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        const res = await api.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        return apiPrivate(originalReq);
      } catch (err) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { apiPrivate };
