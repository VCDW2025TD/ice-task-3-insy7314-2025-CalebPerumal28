import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:5000",
});

// attach token on boot
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// optional: bounce to login on 401
api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
