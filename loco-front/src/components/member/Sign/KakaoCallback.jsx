import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("카카오 로그인 코드:", code);

      axios
        .post("/api/auth/kakao/callback", { code }) // JSON 형식으로 전달
        .then((response) => {
          const { accessToken, refreshToken } = response.data;

          if (accessToken) {
            console.log("카카오 로그인 성공! AccessToken:", accessToken);
            localStorage.setItem("kakao_accessToken", accessToken);
            localStorage.setItem("kakao_refreshToken", refreshToken);

            // Axios 기본 헤더에 Authorization 추가
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;

            navigate("/");
          } else {
            console.error("카카오 로그인 실패:", response.data);
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error(
            "카카오 로그인 에러:",
            error.response?.data || error.message
          );
          navigate("/login");
        });
    } else {
      console.error("카카오 로그인 코드 없음");
      navigate("/login");
    }
  }, [navigate]);

  return <h2>카카오 로그인 중...</h2>;
};

export default KakaoCallback;
