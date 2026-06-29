import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const TOKEN_KEY = "cpe_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authApi = axios.create({ baseURL: API });
authApi.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Resolve a stored asset URL: relative "/api/files/.." -> absolute backend URL; external URLs untouched.
export const resolveAsset = (url) => {
  if (!url) return "";
  return url.startsWith("/api") ? `${process.env.REACT_APP_BACKEND_URL}${url}` : url;
};
