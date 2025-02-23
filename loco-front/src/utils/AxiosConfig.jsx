// import axios from "axios";

// axios.defaults.withCredentials = true;

// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true, // ✅ 쿠키 및 인증 헤더 포함
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("normal_accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default instance;

import axios from "axios";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ 쿠키 및 인증 헤더 포함
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  // 이미 Authorization 헤더가 있으면 변경하지 않음
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("normal_accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
