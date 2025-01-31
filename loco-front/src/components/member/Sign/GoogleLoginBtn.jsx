import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "@/css/member/sign/GoogleLoginBtn.css";

const clientId =
  "461913738960-s9u1nbu4nve43vo3u4r7dnun4er952on.apps.googleusercontent.com";

const GoogleLoginBtn = ({ onSocial }) => {
  const onSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    if (onSocial) onSocial(credentialResponse);
  };

  const onFailure = () => {
    console.error("Login Failed");
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
