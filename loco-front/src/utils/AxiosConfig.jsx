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
//==============================================
import axios from "axios";
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ 쿠키 포함 요청
});

export default instance;

//================================================
// import axios from "axios";

// axios.defaults.withCredentials = true; // ✅ 쿠키 포함 요청

// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true, // ✅ 모든 요청에 쿠키 포함
// });

// // ✅ 요청 인터셉터: Authorization 헤더 자동 추가
// instance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("normal_accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ 응답 인터셉터: 액세스 토큰 만료 시 자동 갱신
// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;

//       try {
//         // ✅ 리프레시 토큰으로 새 액세스 토큰 요청
//         const refreshResponse = await axios.post(
//           "/api/users/auth/token/refresh",
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken =
//           refreshResponse.headers.authorization.split(" ")[1];
//         localStorage.setItem("normal_accessToken", newAccessToken);

//         // ✅ 새로운 토큰으로 기존 요청 재시도
//         error.config.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axios(error.config);
//       } catch (refreshError) {
//         console.error("❌ 토큰 갱신 실패:", refreshError);
//         localStorage.removeItem("normal_accessToken"); // ❌ 액세스 토큰 삭제
//         window.location.href = "/login"; // 🔴 로그인 페이지로 이동
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default instance;
