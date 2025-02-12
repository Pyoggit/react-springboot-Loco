import axios from "axios";

// Axios 기본 설정 (백엔드 API 주소)
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true; // 쿠키를 포함하여 요청

// 모든 요청에 JWT 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    // 일반 유저 토큰(accessToken)이 있으면 우선 사용, 없으면 관리자 토큰(admin_accessToken) 사용
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("admin_accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
