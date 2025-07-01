import { apiPrivate } from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function useAPIPrivate() {
  const navigate = useNavigate();

  useEffect(() => {
    const reqIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("hi");
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resIntercept = apiPrivate.interceptors.response.use(
      ((res) => res,
      (error) => {
        const originalReq = error.config;
        const navigate = useNavigate();

        console.log("hi");

        if (error.response.status == 401) {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          if (!refreshToken) {
            navigate("/login");
            return;
          }

          api
            .post("/api/token/refresh/", { refresh: refreshToken })
            .then((res) => {
              localStorage.setItem(ACCESS_TOKEN, res.data.access);
              return apiPrivate(originalReq);
            })
            .catch((error) => {
              console.log(error);
              if (error.status == 401) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
              }
              navigate("/login");
              return Promise.reject(error);
            });
        }
      })
    );

    return () => {
      apiPrivate.interceptors.request.eject(reqIntercept);
      apiPrivate.interceptors.response.eject(resIntercept);
    };
  }, []);

  return apiPrivate;
}

export default useAPIPrivate;
