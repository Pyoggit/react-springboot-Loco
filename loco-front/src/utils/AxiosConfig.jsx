import axios from "axios";

// Axios 기본 설정 (백엔드 API 주소)
axios.defaults.baseURL = "http://localhost:8080";

// 모든 요청에 JWT 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📌 요청에 포함된 토큰:", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
