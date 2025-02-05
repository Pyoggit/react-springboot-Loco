import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("카카오 로그인 코드:", code);

      fetch("http://localhost:8080/auth/kakao/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // JSON이 아니고 `x-www-form-urlencoded` 사용
        },
        body: new URLSearchParams({ code }), // JSON 아니고 Form Data 형식으로 보냄
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            console.log("카카오 로그인 성공! AccessToken:", data.accessToken);
            localStorage.setItem("token", data.accessToken); // 토큰 저장
            navigate("/"); // 로그인 성공 후 메인 페이지로 이동
          } else {
            console.error(" 카카오 로그인 실패:", data);
            navigate("/member/Sign/LoginMain"); // 로그인 실패 시 로그인 페이지로 이동
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

  return <h2>카카오 로그인 중...</h2>;
};

export default KakaoCallback;
