import axios from "axios";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8080", // ✅ 프론트엔드가 아니라 백엔드로 요청을 보냄
  withCredentials: true, // ✅ 쿠키 및 인증 헤더 포함
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
