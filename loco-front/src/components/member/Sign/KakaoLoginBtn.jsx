import React from "react";
import "@/css/member/sign/KakaoLoginBtn.css";

const KakaoLoginBtn = () => {
  const Rest_api_key = "e1f580827a6c5e6b1a1fc6ae9f79a1c8"; // REST API KEY
  const redirect_uri = "http://localhost:5173/auth"; // Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      kakaoURL,
      "KakaoLogin",
      `width=${width},height=${height},top=${top},left=${left},resizable=no`
    );
  };

  return (
    <button onClick={handleLogin} className="kakao-login-btn">
      카카오 로그인
    </button>
  );
};

export default KakaoLoginBtn;
