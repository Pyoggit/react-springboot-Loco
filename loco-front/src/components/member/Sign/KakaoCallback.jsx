// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "@/utils/AxiosConfig";

// const KakaoCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     if (code) {
//       axios
//         .post("/api/auth/kakao/callback", { code }, { withCredentials: true })
//         .then((response) => {
//           console.log("✅ 카카오 로그인 성공!", response.data);

//           const redirectUrl = response.data.redirect;
//           console.log("📌 리디렉트할 URL:", redirectUrl);

//           setTimeout(() => {
//             navigate(redirectUrl);
//           }, 500);
//         })
//         .catch((error) => {
//           console.error(
//             "카카오 로그인 에러:",
//             error.response?.data || error.message
//           );
//           navigate("/login");
//         });
//     } else {
//       console.error("카카오 로그인 코드 없음");
//       navigate("/login");
//     }
//   }, [navigate]);

//   return <h2>카카오 로그인 중...</h2>;
// };

// export default KakaoCallback;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios
        .post("/api/auth/kakao/callback", { code }) // ✅ 쿠키가 아닌 JSON 응답을 직접 사용
        .then((response) => {
          console.log("✅ 카카오 로그인 성공!", response.data);

          const { kakao_accessToken, kakao_refreshToken } =
            response.data.tokens; // ✅ 응답에서 토큰 가져오기

          // ✅ localStorage에 저장
          localStorage.setItem("kakao_accessToken", kakao_accessToken);
          localStorage.setItem("kakao_refreshToken", kakao_refreshToken);
          console.log("📌 저장된 카카오 토큰:", {
            kakao_accessToken,
            kakao_refreshToken,
          });

          const redirectUrl = response.data.redirect;
          console.log("📌 리디렉트할 URL:", redirectUrl);

          setTimeout(() => {
            window.location.href = redirectUrl; // ✅ 강제 페이지 리로드
          }, 500);
        })
        .catch((error) => {
          console.error(
            "❌ 카카오 로그인 에러:",
            error.response?.data || error.message
          );
          navigate("/login");
        });
    } else {
      console.error("❌ 카카오 로그인 코드 없음");
      navigate("/login");
    }
  }, [navigate]);

  // return <h2>카카오 로그인 중...</h2>;
};

export default KakaoCallback;
