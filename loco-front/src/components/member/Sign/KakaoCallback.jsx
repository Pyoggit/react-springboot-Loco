import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("카카오 로그인 코드:", code); //

      fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "e1f580827a6c5e6b1a1fc6ae9f79a1c8", // REST API KEY
          redirect_uri: "http://localhost:5173/auth/kakao", // redirect_uri
          code: code,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("카카오 access token:", data.access_token);
          if (data.access_token) {
            localStorage.setItem("token", data.access_token); // 토큰 저장
            navigate("/"); // 로그인 성공 후 자동으로 메인 페이지 이동
          } else {
            console.error("카카오 로그인 실패:", data);
            navigate("/member/Sign/LoginMain"); //로그인 실패 시 로그인 페이지로 이동
          }
        })
        .catch((error) => {
          console.error("카카오 로그인 에러:", error);
          navigate("/member/Sign/LoginMain"); // 에러 발생 시 로그인 페이지로 이동
        });
    } else {
      console.error("카카오 로그인 코드 없음");
      navigate("/member/Sign/LoginMain"); // 코드가 없으면 로그인 페이지로 이동
    }
  }, [navigate]);

  return null;
};

export default KakaoCallback;
