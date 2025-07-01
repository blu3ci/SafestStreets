import api, { apiPrivate } from "./api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

export function getUsername() {
  const access = localStorage.getItem(ACCESS_TOKEN);
  if (!access) return "";
  return jwtDecode(access).username;
}

export function prioritizePrivateAPI() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (refreshToken) return apiPrivate;
  return api;
}

export function isSignedIn() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (refreshToken) return true;
  return false;
}
