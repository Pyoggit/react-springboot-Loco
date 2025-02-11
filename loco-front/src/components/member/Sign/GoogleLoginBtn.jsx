import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/GoogleLoginBtn.css";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleLoginBtn = () => {
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    console.log("Google 로그인 성공:", credentialResponse);

    const token = credentialResponse.credential;
    localStorage.setItem("google_token", token);

    try {
      const response = await axios.post("/api/auth/google/callback", { token });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // JWT 저장
        localStorage.setItem("google_accessToken", accessToken);
        localStorage.setItem("google_refreshToken", refreshToken);

        console.log("백엔드에서 받은 google_accessToken:", accessToken);
        console.log("백엔드에서 받은 g00gpe_refreshToken:", refreshToken);

        // 홈으로 이동
        navigate("/");
      } else {
        console.error("Google 로그인 실패:", response.data);
        alert("Google 로그인 실패");
      }
    } catch (error) {
      console.error("Google 로그인 요청 중 오류 발생:", error);
      alert("Google 로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <GoogleLogin onSuccess={onSuccess} theme="outline" size="large" />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
