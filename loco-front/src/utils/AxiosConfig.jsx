// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true,
// });

// // ✅ 요청 인터셉터 (로그아웃 후에는 헤더에 토큰을 안 붙이도록 수정)
// instance.interceptors.request.use(
//   (config) => {
//     // ✅ `document.cookie`에서 직접 쿠키 가져오기 (로그아웃 후 삭제됐는지 확인)
//     const accessToken = document.cookie
//       .split("; ")
//       .find(
//         (row) =>
//           row.startsWith("normal_accessToken=") ||
//           row.startsWith("kakao_accessToken=")
//       )
//       ?.split("=")[1];

//     console.log("🔍 현재 accessToken 값:", accessToken); // ✅ 디버깅 추가

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     } else {
//       console.log("⚠️ accessToken 없음 → 인증 헤더 제거");
//       delete config.headers.Authorization; // ✅ 로그아웃 후 Authorization 헤더 삭제
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default instance;

import axios from "axios";
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ 쿠키 포함 요청
});

export default instance;
