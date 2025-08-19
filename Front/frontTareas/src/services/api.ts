import axios from "axios";
import { Tarea, ApiResponse } from "../types";
import { config } from "../config";

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
