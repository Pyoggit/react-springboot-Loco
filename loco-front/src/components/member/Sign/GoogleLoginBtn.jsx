import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/GoogleLoginBtn.css";

const clientId =
  "461913738960-s9u1nbu4nve43vo3u4r7dnun4er952on.apps.googleusercontent.com";

const GoogleLoginBtn = () => {
  const navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    console.log("Google 로그인 성공:", credentialResponse);

    localStorage.setItem("google_token", credentialResponse.credential);

    navigate("/");
  };

  const onFailure = () => {
    console.error("Google 로그인 실패");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
        theme="outline"
        size="large"
        shape="rectangular"
        text="signin_with"
        width="500"
        className="google-login-btn"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
