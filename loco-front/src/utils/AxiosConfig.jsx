import axios from "axios";

axios.defaults.withCredentials = true; // ✅ CORS 요청 시 쿠키 포함

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ JWT 쿠키 및 인증 헤더 포함
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터: Authorization 헤더 자동 추가
instance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("normal_accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
