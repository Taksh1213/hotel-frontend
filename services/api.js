// services/api.js
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// ========================
// Request interceptor: attach token
// ========================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("accessToken"); // ✅ FIXED TOKEN NAME

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (err) => Promise.reject(err)
);

// ========================
// Response interceptor: handle 401 Unauthorized
// ========================
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { token: refreshToken }
        );

        // ✅ save new token
        localStorage.setItem("accessToken", data.accessToken);

        // ✅ retry request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axios(originalRequest);

      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;