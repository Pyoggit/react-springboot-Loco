import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/KakaoLoginBtn.css";
// import dotenv from "dotenv";

const KakaoLoginBtn = () => {
  const navigate = useNavigate();

  const rest_api_key = import.meta.env.VITE_KAKAO_API_KEY; // REST API KEY
  const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI; // redirect URI
  // const Rest_api_key = "e1f580827a6c5e6b1a1fc6ae9f79a1c8"; // REST API KEY
  // const redirect_uri = "http://localhost:5173/kakao-callback"; // 수정 redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL; // 팝업 없이 리디렉트
  };

  return (
    <button onClick={handleLogin} className="kakao-login-btn">
      카카오 로그인
    </button>
  );
};

export default KakaoLoginBtn;
