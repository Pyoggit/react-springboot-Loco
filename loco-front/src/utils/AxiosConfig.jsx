import axios from "axios";
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true, // ✅ 쿠키 포함 요청
});

export default instance;
