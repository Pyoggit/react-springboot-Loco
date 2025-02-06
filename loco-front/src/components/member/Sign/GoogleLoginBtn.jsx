// import React from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import "@/css/member/sign/GoogleLoginBtn.css";

// const clientId =
//   "461913738960-s9u1nbu4nve43vo3u4r7dnun4er952on.apps.googleusercontent.com";

// const GoogleLoginBtn = () => {
//   const navigate = useNavigate();

//   const onSuccess = (credentialResponse) => {
//     console.log("Google 로그인 성공:", credentialResponse);

//     // 구글 로그인 토큰을 로컬 스토리지에 저장
//     localStorage.setItem("google_token", credentialResponse.credential);

//     // 로그인 성공 후 인덱스 페이지로 이동
//     navigate("/");
//   };

//   const onFailure = () => {
//     console.error("Google 로그인 실패");
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <GoogleLogin
//         onSuccess={onSuccess}
//         onError={onFailure}
//         theme="outline"
//         size="large"
//         shape="rectangular"
//         text="signin_with"
//         width="500"
//         className="google-login-btn"
//       />
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleLoginBtn;

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/GoogleLoginBtn.css";
import dotenv from "dotenv";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const clientId =
//   "461913738960-s9u1nbu4nve43vo3u4r7dnun4er952on.apps.googleusercontent.com";

const GoogleLoginBtn = () => {
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    console.log("Google 로그인 성공:", credentialResponse);

    const token = credentialResponse.credential;
    localStorage.setItem("google_token", token);

    // 백엔드에 Google 로그인 요청 보내기
    try {
      const response = await fetch(
        "http://localhost:8080/auth/google/callback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("백엔드 응답:", data);
        // alert(data.message); // 로그인 성공 메시지 출력

        // 로그인 성공하면 인덱스 페이지로 이동
        if (data.redirect) {
          navigate(data.redirect);
        }
      } else {
        console.log("Google 로그인 실패:", data.error);
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("Google 로그인 요청 중 오류 발생:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <GoogleLogin
        onSuccess={onSuccess}
        // onError={onFailure}
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
