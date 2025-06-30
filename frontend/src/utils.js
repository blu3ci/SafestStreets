import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "./constants";

export function getUsername() {
  return jwtDecode(localStorage.getItem(ACCESS_TOKEN)).username;
}
